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
import {
  RASD_API_TYPE_NAMES_XML,
  RASD_REQUESTS_XML_TEMP,
} from "./constants.mjs";
import createRasdRequestAndUpdateExsysServer from "./createRasdRequestAndUpdateExsysServer.mjs";
import createExsysQueryRequest from "../../helpers/createExsysQueryRequest.mjs";
import updateResultsFolder from "../../helpers/updateResultsFolder.mjs";

const resultsFolderPath = RESULTS_FOLDER_PATHS[CERTIFICATE_NAMES.RASD_XML];

// const x = {
//   dispatchDetailService: [
//     {
//       userName: "62864010000140000",
//       password: "RMOHmoh2005",
//       data: ["732162605", "732162606"],
//     },
//   ],
//   pharmacySaleService: [
//     {
//       userName: "",
//       password: "",
//       toGln: 10,
//       prescriptionDate: "2023-04-06",
//       data: [
//         {
//           gti: "06285096000842",
//           serial: "5C4YDPMWG1",
//           batch: "246M",
//           expiryDate: "2025-07-31",
//         },
//       ],
//     },
//   ],
// };

const {
  dispatchDetailService,
  pharmacySaleService,
  pharmacySaleCancelService,
  dispatchService,
  acceptDispatchService,
  acceptService,
  returnService,
} = RASD_API_TYPE_NAMES_XML;

const buildRasdRequestData = (data, rasdApiName) => {
  if (!data || !data.length) {
    return [false];
  }

  return data.map(({ userName, password, ...options }) => ({
    companySiteRequestOptions: {
      ...companySiteRequestOptions,
      auth: {
        username: userName,
        password: password,
      },
    },
    dataToSendToExsys: options,
    bodyData: RASD_REQUESTS_XML_TEMP[rasdApiName](options),
  }));
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
      apiId: "QUERY_EXSYS_RASD_XML_REQUEST_DATA",
    });

    if (isInternetDisconnected || !isObjectHasData(response)) {
      updateTimeoutRefAndRestart();
      return;
    }

    const {
      [dispatchDetailService]: dispatchDetailServiceData,
      [pharmacySaleService]: pharmacySaleServiceData,
      [pharmacySaleCancelService]: pharmacySaleCancelServiceData,
      [dispatchService]: dispatchServiceData,
      [acceptDispatchService]: acceptDispatchServiceData,
      [acceptService]: acceptServiceData,
      [returnService]: returnServiceData,
    } = response || {};

    const filteredApiBaseData = [
      ...buildRasdRequestData(dispatchDetailServiceData, dispatchDetailService),
      ...buildRasdRequestData(pharmacySaleServiceData, pharmacySaleService),
    ].filter(Boolean);

    if (!filteredApiBaseData.length) {
      setTimeout(
        async () => await startRasdApis(options),
        RESTART_CALLING_EXSYS_QUERY_MS
      );

      return;
    }

    console.log("rasdRequestsData", filteredApiBaseData);

    return;

    // const filteredApiBaseData = [
    //   ...createRasdApiWithData(inventory_accept, inventoryAcceptBody),
    //   ...createRasdApiWithData(inventory_return, inventoryReturnBody),
    //   ...createRasdApiWithData(inventory_transfer, inventoryTransferBody),
    //   ...createRasdApiWithData(pos_sale, posSaleBody),
    //   ...createRasdApiWithData(pos_sale_cancel, posSaleCancelBody),
    //   ...createRasdApiWithData(dispatch_info, dispatchInfoBody),
    // ].filter(({ rasdApiName, bodyData }) => {
    //   const { product_list, notification } = bodyData || {};
    //   return rasdApiName === dispatch_info
    //     ? !!notification
    //     : !!(product_list || []).length;
    // });

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
        isProduction,
        exsysBaseUrl,
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
