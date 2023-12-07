/*
 *
 * Engine: `startRasdApis`.
 *
 */
import { isObjectHasData } from "@exsys-server/helpers";
import {
  CERTIFICATE_NAMES,
  RESULTS_FOLDER_PATHS,
  RESTART_CALLING_EXSYS_QUERY_MS,
} from "../../constants.mjs";
import createRasdRequestAndUpdateExsysServer from "./createRasdRequestAndUpdateExsysServer.mjs";
import createExsysQueryRequest from "../../helpers/createExsysQueryRequest.mjs";
import updateResultsFolder from "../../helpers/updateResultsFolder.mjs";
import buildRasdRequestDataFromExsysResponse from "./buildRasdRequestDataFromExsysResponse.js";

const resultsFolderPath = RESULTS_FOLDER_PATHS[CERTIFICATE_NAMES.RASD_XML];

const startRasdApis = async (options) => {
  try {
    const {
      updateTimeoutRefAndRestart,
      companySiteRequestOptions,
      isProduction,
      exsysBaseUrl,
    } = options;
    const { response, isInternetDisconnected } = await createExsysQueryRequest({
      exsysBaseUrl,
      apiId: "QUERY_EXSYS_RASD_XML_REQUEST_DATA",
    });

    if (isInternetDisconnected) {
      updateTimeoutRefAndRestart();
      return;
    }

    if (!isObjectHasData(response)) {
      setTimeout(
        async () => await startRasdApis(options),
        RESTART_CALLING_EXSYS_QUERY_MS
      );
      return;
    }

    const rasdApiBaseData = buildRasdRequestDataFromExsysResponse({
      response,
      companySiteRequestOptions,
      isProduction,
      exsysBaseUrl,
    });

    if (!rasdApiBaseData.length) {
      setTimeout(
        async () => await startRasdApis(options),
        RESTART_CALLING_EXSYS_QUERY_MS
      );

      return;
    }

    const configPromises = rasdApiBaseData.map((options) =>
      createRasdRequestAndUpdateExsysServer(options)
    );

    const results = await Promise.allSettled(configPromises);

    const { shouldRestartServer, localResultsToPrint } = results.reduce(
      (acc, { value }) => {
        if (!value) {
          return acc;
        }
        const {
          localResultsData,
          shouldRestartServer: itemShouldRestartServer,
        } = value;
        acc.localResultsToPrint = [
          ...acc.localResultsToPrint,
          localResultsData,
        ];
        acc.shouldRestartServer =
          itemShouldRestartServer || acc.shouldRestartServer;

        return acc;
      },
      {
        shouldRestartServer: false,
        localResultsToPrint: [],
      }
    );

    await updateResultsFolder({
      resultsFolderPath,
      data: localResultsToPrint,
    });

    if (shouldRestartServer) {
      updateTimeoutRefAndRestart();
      return;
    }

    await startRasdApis(options);
  } catch (error) {
    console.error("error", error);
    setTimeout(
      async () => await startRasdApis(options),
      RESTART_CALLING_EXSYS_QUERY_MS
    );
  }
};

export default startRasdApis;
