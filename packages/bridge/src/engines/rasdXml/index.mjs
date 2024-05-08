/*
 *
 * Engine: `startRasdApis`.
 *
 */
import { isArrayHasData, isObjectHasData } from "@exsys-server/helpers";
import {
  CERTIFICATE_NAMES,
  RESULTS_FOLDER_PATHS,
  RASD_TIME_OUT_MS,
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
      setTimeout(async () => await startRasdApis(options), RASD_TIME_OUT_MS);
      return;
    }

    const rasdApiBaseData = buildRasdRequestDataFromExsysResponse({
      response,
      companySiteRequestOptions,
      isProduction,
      exsysBaseUrl,
    });

    if (!isArrayHasData(rasdApiBaseData)) {
      setTimeout(async () => await startRasdApis(options), RASD_TIME_OUT_MS);

      return;
    }

    let localResultsToPrint = [];
    let shouldRestartServer = false;

    while (rasdApiBaseData.length) {
      const [requestData] = rasdApiBaseData.splice(0, 1);

      const response = await createRasdRequestAndUpdateExsysServer(requestData);

      if (response) {
        const {
          localResultsData,
          shouldRestartServer: itemShouldRestartServer,
        } = response;
        localResultsToPrint = localResultsToPrint.concat(localResultsData);
        shouldRestartServer = itemShouldRestartServer || shouldRestartServer;
      }
    }

    await updateResultsFolder({
      resultsFolderPath,
      data: localResultsToPrint,
    });

    if (shouldRestartServer) {
      updateTimeoutRefAndRestart();
      return;
    }

    setTimeout(async () => await startRasdApis(options), RASD_TIME_OUT_MS);
  } catch (error) {
    console.error("error", error);
    setTimeout(async () => await startRasdApis(options), RASD_TIME_OUT_MS);
  }
};

export default startRasdApis;
