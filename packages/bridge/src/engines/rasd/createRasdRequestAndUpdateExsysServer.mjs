/*
 *
 * Helper: `createRasdRequestAndUpdateExsysServer`.
 *
 */
import axios from "axios";
import { COMPANY_API_URLS, RASD_API_TYPE_NAMES } from "../../constants.mjs";
import printRequestNetworkError from "../../helpers/printRequestNetworkError.mjs";
import postCompanyDataResponseToExsysDB from "../../helpers/postCompanyDataResponseToExsysDB.mjs";

const { RASD_PRODUCTION, RASD_DEVELOPMENT } = COMPANY_API_URLS;
const { dispatch_info } = RASD_API_TYPE_NAMES;

const createRasdRequestAndUpdateExsysServer = async ({
  rasdApiName,
  bodyData,
  companySiteRequestOptions,
  isProduction,
  exsysBaseUrl,
}) => {
  const baseApiUrl = isProduction ? RASD_PRODUCTION : RASD_DEVELOPMENT;

  let response;
  let fetchError;
  let isInternetDisconnected = false;
  let responseStatus;

  const apiUrl = `${baseApiUrl}/${rasdApiName}`;

  try {
    const { data, status } = await axios.post(
      apiUrl,
      bodyData,
      companySiteRequestOptions
    );
    response = data;
    responseStatus = status;
  } catch (apiFetchError) {
    fetchError = apiFetchError;
    const { response: rasdResponse } = fetchError || {};
    const { data: rasdResponseData } = rasdResponse || {};

    if (rasdResponseData) {
      response = rasdResponseData;
    }
    isInternetDisconnected = true;
  }

  isInternetDisconnected = printRequestNetworkError({
    fetchError,
    apiUrl,
    isInternetDisconnected,
    isPostRequest: true,
  });

  const iSuccessStatus = [200, 201].includes(responseStatus);
  const { statusCode } = response || {};

  const isInternalServerError = statusCode === 500 || responseStatus === 500;

  const shouldPostDataToExsys =
    !isInternetDisconnected && !isInternalServerError && iSuccessStatus;

  const { notification } = bodyData;
  const isDispatchInfoApis = rasdApiName === dispatch_info;

  let curredRasdResponse = response || [];

  if (isDispatchInfoApis) {
    if (Array.isArray(response)) {
      curredRasdResponse = response.map((item) => ({
        ...item,
        notification_id: notification,
      }));
    } else {
      curredRasdResponse = {
        ...(response || null),
        notification_id: notification,
      };
    }
  }

  const apiPostDataToExsys = {
    type: rasdApiName,
    data: curredRasdResponse,
  };

  const {
    isInternetDisconnectedWhenPostingNafiesDataToExsys,
    isSuccessPostingDataToExsys,
    isDataSentToExsys,
  } = shouldPostDataToExsys
    ? await postCompanyDataResponseToExsysDB({
        apiId: "POST_RASD_REQUEST_DATA_TO_EXSYS",
        apiPostData: apiPostDataToExsys,
        exsysBaseUrl,
      })
    : {
        isInternetDisconnectedWhenPostingNafiesDataToExsys: false,
        isSuccessPostingDataToExsys: false,
        isDataSentToExsys: false,
      };

  return {
    shouldRestartServer:
      isInternetDisconnected ||
      isInternetDisconnectedWhenPostingNafiesDataToExsys,
    localResultsData: {
      rasdApiName,
      exsysDataSentToRasdServer: bodyData,
      rasdResponseBasedExsysData: apiPostDataToExsys,
      isRasdDataSentToExsys: isDataSentToExsys,
      successededToPostRasdDataToExsysServer:
        isInternetDisconnectedWhenPostingNafiesDataToExsys
          ? false
          : isSuccessPostingDataToExsys,
    },
  };
};

export default createRasdRequestAndUpdateExsysServer;
