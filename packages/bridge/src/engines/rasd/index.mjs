/*
 *
 * Engine: `startRasdApis`.
 *
 */
import createRasdRequestAndUpdateExsysServer from "./createRasdRequestAndUpdateExsysServer.mjs";
import createExsysQueryRequest from "../../helpers/createExsysQueryRequest.mjs";
import {
  RESTART_CALLING_EXSYS_QUERY_MS,
  RASD_API_TYPE_NAMES,
} from "../../constants.mjs";

const {
  inventory_accept,
  inventory_return,
  pos_sale,
  pos_sale_cancel,
} = RASD_API_TYPE_NAMES;

const startRasdApis = async (options) => {
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
    [pos_sale]: PosSaleBody,
    [pos_sale_cancel]: PosSaleCancelBody,
  } = response || {};


  const filteredApiBaseData = [
    {
      rasdApiName: inventory_accept,
      bodyData: inventoryAcceptBody,
    },
    {
      rasdApiName: inventory_return,
      bodyData: inventoryReturnBody,
    },
    {
      rasdApiName: pos_sale,
      bodyData: PosSaleBody,
    },
    {
      rasdApiName: pos_sale_cancel,
      bodyData: PosSaleCancelBody,
    },
  ].filter(({ bodyData }) => {
    const { product_list } = bodyData || {};
    return !!(product_list || []).length;
  });

  const requestsLength = filteredApiBaseData.length

  if (!requestsLength) {
    setTimeout(
      async () => await startRasdApis(options),
      RESTART_CALLING_EXSYS_QUERY_MS
    );

    return;
  }

  const handleDone = async (index) => (options) => {
    const isLastApiCall = requestsLength - 1 === index;

    if(isLastApiCall){
      await startRasdApis(options)
    }
  }

  const configPromises = filteredApiBaseData.map((data, index) =>
    createRasdRequestAndUpdateExsysServer({
      ...data,
      companySiteRequestOptions,
      updateTimeoutRefAndRestart,
      onDone: handleDone(index),
    })
  );

  await Promise.all(configPromises);
};

export default startRasdApis;

