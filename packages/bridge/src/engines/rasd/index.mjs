/*
 *
 * Engine: `startRasdApis`.
 *
 */
import {
  CERTIFICATE_NAMES,
  RESULTS_FOLDER_PATHS,
  RESTART_CALLING_EXSYS_QUERY_MS,
  RASD_API_TYPE_NAMES,
} from "../../constants.mjs";
import createRasdRequestAndUpdateExsysServer from "./createRasdRequestAndUpdateExsysServer.mjs";
import createExsysQueryRequest from "../../helpers/createExsysQueryRequest.mjs";
import updateResultsFolder from "../../helpers/updateResultsFolder.mjs";

const resultsFolderPath = RESULTS_FOLDER_PATHS[CERTIFICATE_NAMES.RASD];

const {
  inventory_accept,
  inventory_return,
  pos_sale,
  pos_sale_cancel,
  inventory_transfer,
  dispatch_info,
} = RASD_API_TYPE_NAMES;

const createRasdApiWithData = (rasdApiName, baseData) => {
  let apiWithData = [];
  if (Array.isArray(baseData) && baseData.length) {
    apiWithData = baseData.map((bodyData) => ({
      rasdApiName,
      bodyData,
    }));
  }

  return apiWithData;
};

const startRasdApis = async (options) => {
  try {
    const { updateTimeoutRefAndRestart, companySiteRequestOptions } = options;
    const { response, isInternetDisconnected } = await createExsysQueryRequest({
      apiId: "QUERY_EXSYS_RASD_REQUEST_DATA",
    });

    if (isInternetDisconnected) {
      updateTimeoutRefAndRestart();
      return;
    }

    const {
      [inventory_accept]: inventoryAcceptBody,
      [inventory_return]: inventoryReturnBody,
      [inventory_transfer]: inventoryTransferBody,
      [pos_sale]: posSaleBody,
      [pos_sale_cancel]: posSaleCancelBody,
      [dispatch_info]: dispatchInfoBody,
    } = response || {};

    const filteredApiBaseData = [
      ...createRasdApiWithData(inventory_accept, inventoryAcceptBody),
      ...createRasdApiWithData(inventory_return, inventoryReturnBody),
      ...createRasdApiWithData(inventory_transfer, inventoryTransferBody),
      ...createRasdApiWithData(pos_sale, posSaleBody),
      ...createRasdApiWithData(pos_sale_cancel, posSaleCancelBody),
      ...createRasdApiWithData(dispatch_info, dispatchInfoBody),
    ].filter(({ rasdApiName, bodyData }) => {
      const { product_list, notification } = bodyData || {};
      return rasdApiName === dispatch_info
        ? !!notification
        : !!(product_list || []).length;
    });

    const requestsLength = filteredApiBaseData.length;

    if (!requestsLength) {
      setTimeout(
        async () => await startRasdApis(options),
        RESTART_CALLING_EXSYS_QUERY_MS
      );

      return;
    }

    const configPromises = filteredApiBaseData.map((data) =>
      createRasdRequestAndUpdateExsysServer({
        ...data,
        companySiteRequestOptions,
      })
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
