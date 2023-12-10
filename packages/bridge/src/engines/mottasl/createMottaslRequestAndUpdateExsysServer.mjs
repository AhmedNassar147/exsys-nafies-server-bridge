/*
 *
 * Helper: `createMottaslRequestAndUpdateExsysServer`.
 *
 */
import { COMPANY_API_URLS } from "../../constants.mjs";

import createAxiosPostRequest from "../../helpers/createAxiosPostRequest.mjs";
import postCompanyDataResponseToExsysDB from "../../helpers/postCompanyDataResponseToExsysDB.mjs";

const { MOTTASL_PRODUCTION } = COMPANY_API_URLS;

const createMottaslRequestAndUpdateExsysServer = async ({
  bodyData,
  companySiteRequestOptions,
  exsysBaseUrl,
  messageId,
}) => {
  const { response, responseStatus } = await createAxiosPostRequest({
    apiUrl: MOTTASL_PRODUCTION,
    bodyData,
    requestOptions: companySiteRequestOptions,
  });

  const {
    status,
    statusText,
    messageId: whatsapp_message_id,
    customerId,
  } = response || {};

  const apiPostDataToExsys = {
    status: status || responseStatus,
    statusText,
    message_id: messageId,
    whatsapp_message_id,
    customerId,
  };

  const {
    isInternetDisconnectedWhenPostingDataToExsys,
    isSuccessPostingDataToExsys,
    isDataSentToExsys,
  } = await postCompanyDataResponseToExsysDB({
    apiId: "POST_TADAWY_RESPONSE_TO_EXSYS",
    apiPostData: apiPostDataToExsys,
    exsysBaseUrl,
  });

  return {
    shouldRestartServer: isInternetDisconnectedWhenPostingDataToExsys,
    localResultsData: {
      exsysDataSentToTadawyServer: bodyData,
      tadawyResponseBasedExsysData: response,
      dataSentToExsysBasedTadawyResponse: apiPostDataToExsys,
      isTadawyDataSentToExsys: isDataSentToExsys,
      successededToPostTadawyDataToExsysServer:
        isInternetDisconnectedWhenPostingDataToExsys
          ? false
          : isSuccessPostingDataToExsys,
    },
  };
};

export default createMottaslRequestAndUpdateExsysServer;
