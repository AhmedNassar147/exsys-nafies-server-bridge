/*
 *
 * Engine: `startRasdApis`.
 *
 */
import {
  CERTIFICATE_NAMES,
  RESULTS_FOLDER_PATHS,
  RASD_TIME_OUT_MS,
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
  inventory_accept_batch,
  inventory_transfer_batch,
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
    const {
      updateTimeoutRefAndRestart,
      companySiteRequestOptions,
      isProduction,
      exsysBaseUrl,
    } = options;
    const { response, isInternetDisconnected } = await createExsysQueryRequest({
      exsysBaseUrl,
      apiId: "QUERY_EXSYS_RASD_REQUEST_DATA",
    });

    if (isInternetDisconnected) {
      updateTimeoutRefAndRestart();
      return;
    }

    const {
      rsd_trace_type,
      [inventory_accept]: inventoryAcceptBody,
      [inventory_return]: inventoryReturnBody,
      [inventory_transfer]: inventoryTransferBody,
      [pos_sale]: posSaleBody,
      [pos_sale_cancel]: posSaleCancelBody,
      [dispatch_info]: dispatchInfoBody,
      [inventory_accept_batch]: inventoryAcceptBatchBody,
      [inventory_transfer_batch]: inventoryTransferBatchBody,
    } = response || {};

    const filteredApiBaseData = [
      ...createRasdApiWithData(inventory_accept, inventoryAcceptBody),
      ...createRasdApiWithData(inventory_return, inventoryReturnBody),
      ...createRasdApiWithData(inventory_transfer, inventoryTransferBody),
      ...createRasdApiWithData(pos_sale, posSaleBody),
      ...createRasdApiWithData(pos_sale_cancel, posSaleCancelBody),
      ...createRasdApiWithData(dispatch_info, dispatchInfoBody),
      ...createRasdApiWithData(
        inventory_accept_batch,
        inventoryAcceptBatchBody
      ),
      ...createRasdApiWithData(
        inventory_transfer_batch,
        inventoryTransferBatchBody
      ),
    ].filter(({ rasdApiName, bodyData }) => {
      const { product_list, notification } = bodyData || {};
      return rasdApiName === dispatch_info
        ? !!notification
        : !!(product_list || []).length;
    });

    const requestsLength = filteredApiBaseData.length;

    if (!requestsLength) {
      setTimeout(async () => await startRasdApis(options), RASD_TIME_OUT_MS);

      return;
    }

    const configPromises = filteredApiBaseData.map((data) =>
      createRasdRequestAndUpdateExsysServer({
        ...data,
        companySiteRequestOptions,
        isProduction,
        exsysBaseUrl,
        rsdTraceType: rsd_trace_type,
      })
    );

    const results = await Promise.allSettled(configPromises);

    const { shouldRestartServer, localResultsToPrint } = results.reduce(
      (
        acc,
        {
          value: {
            localResultsData,
            shouldRestartServer: itemShouldRestartServer,
          },
        }
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

    setTimeout(async () => await startRasdApis(options), RASD_TIME_OUT_MS);
  } catch (error) {
    console.error("error", error);
    setTimeout(async () => await startRasdApis(options), RASD_TIME_OUT_MS);
  }
};

export default startRasdApis;
