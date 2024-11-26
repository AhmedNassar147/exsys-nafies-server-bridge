/*
 *
 * Helper: `createWhatsAppRequestAndUpdateExsysServer`.
 *
 */
import { camelCaseFirstLetter } from "@exsys-server/helpers";
import { COMPANY_API_URLS, CERTIFICATE_NAMES } from "../../constants.mjs";
import createAxiosPostRequest from "../../helpers/createAxiosPostRequest.mjs";
import postCompanyDataResponseToExsysDB from "../../helpers/postCompanyDataResponseToExsysDB.mjs";

const { MOTTASL, TAQNYAT_WHATSAPP, JAWALY_4_WHATSAPP } = CERTIFICATE_NAMES;

const {
  MOTTASL_PRODUCTION,
  TAQNYAT_WHATSAPP_PRODUCTION,
  JAWALY_4_WHATSAPP_PRODUCTION,
} = COMPANY_API_URLS;

const variablesMap = {
  [MOTTASL]: {
    apiUrl: MOTTASL_PRODUCTION,
    createExsysDataFromResponse: (response, responseStatus) => {
      const {
        status,
        statusText,
        messageId: whatsapp_message_id,
        customerId,
      } = response;

      return {
        status: status || responseStatus,
        statusText,
        whatsapp_message_id,
        customerId,
      };
    },
  },
  [TAQNYAT_WHATSAPP]: {
    apiUrl: TAQNYAT_WHATSAPP_PRODUCTION,
    createExsysDataFromResponse: (response, responseStatus) => {
      const { statuses } = response;

      const { message_id: whatsapp_message_id } = statuses || {};

      return {
        status: responseStatus,
        whatsapp_message_id,
      };
    },
  },

  [JAWALY_4_WHATSAPP]: {
    apiUrl: JAWALY_4_WHATSAPP_PRODUCTION,
    createExsysDataFromResponse: (response, responseStatus) => {
      const {
        id: whatsapp_message_id,
        sent,
        message,
        number,
        description,
      } = response;

      return {
        status: responseStatus,
        statusText: !!sent ? "ok" : undefined,
        whatsapp_message_id,
        sent,
        message,
        description,
        number,
      };
    },
  },
};

const createWhatsAppRequestAndUpdateExsysServer = async ({
  bodyData,
  companySiteRequestOptions,
  exsysBaseUrl,
  messageId,
  companyName,
}) => {
  const { apiUrl, createExsysDataFromResponse } = variablesMap[companyName];

  const { response, responseStatus } = await createAxiosPostRequest({
    apiUrl,
    bodyData,
    requestOptions: companySiteRequestOptions,
  });

  const __response = response || {};

  const finalResults = createExsysDataFromResponse(__response, responseStatus);

  const apiPostDataToExsys = {
    message_id: messageId,
    ...finalResults,
  };

  const {
    isInternetDisconnectedWhenPostingDataToExsys,
    isSuccessPostingDataToExsys,
    isDataSentToExsys,
  } = await postCompanyDataResponseToExsysDB({
    apiId: "POST_WHATSAPP_RESPONSE_TO_EXSYS",
    apiPostData: apiPostDataToExsys,
    exsysBaseUrl,
  });

  const _companyName = camelCaseFirstLetter(
    companyName
      .toLowerCase()
      .replace(/\_\w/, (s) => s.toUpperCase().replace("_", ""))
  );

  return {
    shouldRestartServer: isInternetDisconnectedWhenPostingDataToExsys,
    localResultsData: {
      [`exsysDataSentTo${_companyName}Server`]: bodyData,
      [`${_companyName}Response`]: response,
      [`dataSentToExsysBased${_companyName}Response`]: apiPostDataToExsys,
      [`is${_companyName}DataSentToExsys`]: isDataSentToExsys,
      [`succeededToPost${_companyName}DataToExsysServer`]:
        isInternetDisconnectedWhenPostingDataToExsys
          ? false
          : isSuccessPostingDataToExsys,
    },
  };
};

export default createWhatsAppRequestAndUpdateExsysServer;
