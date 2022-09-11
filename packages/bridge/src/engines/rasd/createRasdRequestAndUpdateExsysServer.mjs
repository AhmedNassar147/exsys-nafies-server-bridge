/*
 *
 * Helper: `createRasdRequestAndUpdateExsysServer`.
 *
 */
import axios from "axios";
import {
  COMPANY_API_URLS,
  RESULTS_FOLDER_PATHS,
  CERTIFICATE_NAMES,
  RASD_API_TYPE_NAMES,
} from "../../constants.mjs";
import printRequestNetworkError from "../../helpers/printRequestNetworkError.mjs";
import postCompanyDataResponseToExsysDB from "../../helpers/postCompanyDataResponseToExsysDB.mjs";
import updateResultsFolder from "../../helpers/updateResultsFolder.mjs";

const baseApiUrl = COMPANY_API_URLS.RASD_PRODUCTION;
const { dispatch_info } = RASD_API_TYPE_NAMES;

const createRasdRequestAndUpdateExsysServer = async ({
  rasdApiName,
  bodyData,
  companySiteRequestOptions,
  updateTimeoutRefAndRestart,
  onDone,
}) => {
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

  // console.log("response", {
  //   response,
  //   rasdApiName,
  //   responseStatus,
  //   iSuccessStatus,
  //   statusCode,
  //   isInternetDisconnected,
  //   apiUrl,
  // });

  const doneFnOptions = {
    companySiteRequestOptions,
    updateTimeoutRefAndRestart,
  };

  const isInternalServerError = statusCode === 500 || responseStatus === 500;

  if (isInternetDisconnected || isInternalServerError || !iSuccessStatus) {
    if (isInternetDisconnected) {
      updateTimeoutRefAndRestart();
    }

    if ((!iSuccessStatus || isInternalServerError) && !isInternetDisconnected) {
      await onDone(doneFnOptions);
    }

    return;
  }

  const { notification } = bodyData;
  const isDispatchInfoApis = rasdApiName === dispatch_info;

  const curredRasdResponse = response || [];

  if (isDispatchInfoApis) {
    if (Array.isArray(response)) {
      curredRasdResponse = response.map((item) => ({ ...item, notification }));
    } else {
      curredRasdResponse = {
        ...(response || null),
        notification,
      };
    }
  }

  const apiPostDataToExsys = {
    type: rasdApiName,
    data: curredRasdResponse,
  };

  const handleExsysDataAfterPost = async (
    isSuccess,
    isInternetDisconnected
  ) => {
    await updateResultsFolder({
      resultsFolderPath: RESULTS_FOLDER_PATHS[CERTIFICATE_NAMES.RASD],
      data: {
        rasdApiName,
        exsysDataSentToRasdServer: bodyData,
        rasdResponseBasedExsysData: apiPostDataToExsys,
        successededToPostRasdDataToExsysServer: isInternetDisconnected
          ? false
          : isSuccess,
      },
    });

    if (!isInternetDisconnected) {
      await onDone(doneFnOptions);
    }
  };

  const { isInternetDisconnectedWhenPostingNafiesDataToExsys } =
    await postCompanyDataResponseToExsysDB({
      apiId: "POST_RASD_REQUEST_DATA_TO_EXSYS",
      apiPostData: apiPostDataToExsys,
      onDone: handleExsysDataAfterPost,
    });

  if (isInternetDisconnectedWhenPostingNafiesDataToExsys) {
    updateTimeoutRefAndRestart();
  }
};

export default createRasdRequestAndUpdateExsysServer;
