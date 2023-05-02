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
import { RASD_API_TYPE_NAMES_XML } from "./constants.mjs";
import createRasdRequestAndUpdateExsysServer from "./createRasdRequestAndUpdateExsysServer.mjs";
import createBuildRasdRequestData from "./createBuildRasdRequestData.mjs";
import createExsysQueryRequest from "../../helpers/createExsysQueryRequest.mjs";
import updateResultsFolder from "../../helpers/updateResultsFolder.mjs";

const resultsFolderPath = RESULTS_FOLDER_PATHS[CERTIFICATE_NAMES.RASD_XML];

const {
  dispatchDetailService,
  pharmacySaleService,
  pharmacySaleCancelService,
  dispatchService,
  acceptDispatchService,
  acceptService,
  returnService,
} = RASD_API_TYPE_NAMES_XML;

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

    const {
      [dispatchDetailService]: dispatchDetailServiceData,
      [acceptDispatchService]: acceptDispatchServiceData,
      [acceptService]: acceptServiceData,
      [returnService]: returnServiceData,
      [pharmacySaleService]: pharmacySaleServiceData,
      [pharmacySaleCancelService]: pharmacySaleCancelServiceData,
      [dispatchService]: dispatchServiceData,
    } = response || {};

    const buildRasdRequestData = createBuildRasdRequestData({
      companySiteRequestOptions,
      isProduction,
      exsysBaseUrl,
    });

    const filteredApiBaseData = [
      ...buildRasdRequestData(dispatchDetailServiceData, dispatchDetailService),
      ...buildRasdRequestData(acceptDispatchServiceData, acceptDispatchService),
      // ...buildRasdRequestData(acceptServiceData, acceptService),
      // ...buildRasdRequestData(returnServiceData, returnService),
      // ...buildRasdRequestData(dispatchServiceData, dispatchService),
      // ...buildRasdRequestData(pharmacySaleServiceData, pharmacySaleService),
      // ...buildRasdRequestData(
      //   pharmacySaleCancelServiceData,
      //   pharmacySaleCancelService
      // ),
    ].filter(Boolean);

    if (!filteredApiBaseData.length) {
      setTimeout(
        async () => await startRasdApis(options),
        RESTART_CALLING_EXSYS_QUERY_MS
      );

      return;
    }

    const configPromises = filteredApiBaseData.map((options) =>
      createRasdRequestAndUpdateExsysServer(options)
    );

    const results = await Promise.all(configPromises);

    const { shouldRestartServer, localResultsToPrint } = results.reduce(
      (
        acc,
        { localResultsData, shouldRestartServer: itemShouldRestartServer }
      ) => {
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
