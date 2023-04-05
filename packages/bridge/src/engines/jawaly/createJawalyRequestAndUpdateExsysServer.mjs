/*
 *
 * Helper: `createJawalyRequestAndUpdateExsysServer`.
 *
 */
import axios from "axios";
import { COMPANY_API_URLS } from "../../constants.mjs";
import postCompanyDataResponseToExsysDB from "../../helpers/postCompanyDataResponseToExsysDB.mjs";

const { JAWALY_PRODUCTION } = COMPANY_API_URLS;

const createJawalyRequestAndUpdateExsysServer = async ({
  bodyData,
  companySiteRequestOptions,
  exsysBaseUrl,
  message_id,
}) => {
  let response;
  let responseStatus;

  try {
    const { data, status } = await axios.post(
      JAWALY_PRODUCTION,
      bodyData,
      companySiteRequestOptions
    );
    response = data;
    responseStatus = status;
  } catch (apiFetchError) {
    const { response: jawalyResponse } = apiFetchError || {};
    const { data: jawalyResponseData, status } = jawalyResponse || {};

    responseStatus = status;
    response = jawalyResponseData;
  }

  const { code, message, job_id } = response || {};
  const foundResponseStatus = code || responseStatus;

  const apiPostDataToExsys = {
    status: foundResponseStatus,
    message_id,
    job_id,
    error_details: job_id ? undefined : message,
  };

  const {
    isInternetDisconnectedWhenPostingDataToExsys,
    isSuccessPostingDataToExsys,
    isDataSentToExsys,
  } = await postCompanyDataResponseToExsysDB({
    apiId: "POST_JAWALY_RESPONSE_TO_EXSYS",
    apiPostData: apiPostDataToExsys,
    exsysBaseUrl,
  });

  return {
    shouldRestartServer: isInternetDisconnectedWhenPostingDataToExsys,
    localResultsData: {
      exsysDataSentToJawalyServer: bodyData,
      jawalyResponseBasedExsysData: response,
      dataSentToExsysBasedJawalyResponse: apiPostDataToExsys,
      isJawalyDataSentToExsys: isDataSentToExsys,
      successededToPostJawalyDataToExsysServer:
        isInternetDisconnectedWhenPostingDataToExsys
          ? false
          : isSuccessPostingDataToExsys,
    },
  };
};

export default createJawalyRequestAndUpdateExsysServer;
