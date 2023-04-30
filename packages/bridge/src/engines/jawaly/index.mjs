/*
 *
 * Engine: `startSmsApis`.
 *
 */
import { createCmdMessage, isObjectHasData } from "@exsys-server/helpers";
import { RESTART_CALLING_EXSYS_QUERY_MS } from "../../constants.mjs";
import getDataFromResponse from "./getDataFromResponse.mjs";
import createDataWillBePostedToExsys from "./createDataWillBePostedToExsys.mjs";
import createSmsRequestAndUpdateExsysServer from "./createSmsRequestAndUpdateExsysServer.mjs";
import createExsysQueryRequest from "../../helpers/createExsysQueryRequest.mjs";
import updateResultsFolder from "../../helpers/updateResultsFolder.mjs";

const startSmsApis = async (options) => {
  try {
    const {
      updateTimeoutRefAndRestart,
      companySiteRequestOptions,
      isProduction,
      exsysBaseUrl,
    } = options;

    const { response, isInternetDisconnected } = await createExsysQueryRequest({
      exsysBaseUrl,
      apiId: "QUERY_EXSYS_WHATSAPP_SMS_NOT_SEND_DATA",
    });

    if (isInternetDisconnected) {
      updateTimeoutRefAndRestart();
      return;
    }

    if (!isObjectHasData(response)) {
      setTimeout(
        async () => await startSmsApis(options),
        RESTART_CALLING_EXSYS_QUERY_MS
      );

      return;
    }

    const formattedResults = getDataFromResponse(response);
    const {
      restartIf,
      resultsFolderPath,
      companySiteRequestOptionsAuth,
      printNoCompanyProvided,
      requestDataParamsOrBody,
      dataToSendToExsys,
      smsSendingCompanyName,
      companyApiUrl,
      isCompanyQueryPostByQueryFetch,
    } = formattedResults || {};

    if (printNoCompanyProvided) {
      createCmdMessage({
        type: "error",
        message:
          "`sms_sending_company_name` is not found in `QUERY_EXSYS_WHATSAPP_SMS_NOT_SEND_DATA` api",
      });
    }

    if (restartIf) {
      setTimeout(
        async () => await startSmsApis(options),
        RESTART_CALLING_EXSYS_QUERY_MS
      );

      return;
    }

    const { localResultsData, shouldRestartServer } =
      await createSmsRequestAndUpdateExsysServer({
        isProduction,
        exsysBaseUrl,
        companyApiUrl,
        isCompanyQueryPostByQueryFetch,
        createDataWillBePostedToExsys: createDataWillBePostedToExsys({
          smsSendingCompanyName,
          dataToSendToExsys,
        }),
        bodyData: requestDataParamsOrBody,
        companySiteRequestOptions: {
          ...companySiteRequestOptions,
          auth: companySiteRequestOptionsAuth,
        },
      });

    await updateResultsFolder({
      resultsFolderPath,
      data: localResultsData,
    });

    if (shouldRestartServer) {
      updateTimeoutRefAndRestart();
      return;
    }

    await startSmsApis(options);
  } catch (error) {
    console.error("error", error);
    setTimeout(
      async () => await startSmsApis(options),
      RESTART_CALLING_EXSYS_QUERY_MS
    );
  }
};

export default startSmsApis;
