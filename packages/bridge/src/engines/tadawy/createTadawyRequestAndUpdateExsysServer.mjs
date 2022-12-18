/*
 *
 * Helper: `createTadawyRequestAndUpdateExsysServer`.
 *
 */
import axios from "axios";
import { COMPANY_API_URLS } from "../../constants.mjs";
import postCompanyDataResponseToExsysDB from "../../helpers/postCompanyDataResponseToExsysDB.mjs";

const { TADAWY_PRODUCTION } = COMPANY_API_URLS;

const createTadawyRequestAndUpdateExsysServer = async ({
  bodyData,
  companySiteRequestOptions,
  // isProduction,
  exsysBaseUrl,
  message_id,
}) => {
  let response;
  let responseStatus;

  try {
    const { data, status } = await axios.post(
      TADAWY_PRODUCTION,
      bodyData,
      companySiteRequestOptions
    );
    response = data;
    responseStatus = status;
  } catch (apiFetchError) {
    const { response: tadawyResponse } = apiFetchError || {};
    const { data: tadawyResponseData, status } = tadawyResponse || {};

    responseStatus = status;
    response = tadawyResponseData;
  }

  const { messages, meta, errors } = response || {};
  const foundResponseStatus = responseStatus;

  let whatsapp_message_id;
  let error_details = "";

  if (messages) {
    const [firstMessage] = messages || [];
    const { id } = firstMessage;

    whatsapp_message_id = id;
  }

  if (!whatsapp_message_id) {
    const { developer_message } = meta || {};
    error_details = developer_message
      ? `${developer_message}, `
      : error_details;

    if (errors && errors.length) {
      error_details += errors.reduce((acc, { title }) => {
        acc += `${title}, `;
        return acc;
      }, "");
    }
  }

  const apiPostDataToExsys = {
    status: foundResponseStatus,
    message_id,
    whatsapp_message_id: whatsapp_message_id,
    error_details: error_details || undefined,
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

export default createTadawyRequestAndUpdateExsysServer;
