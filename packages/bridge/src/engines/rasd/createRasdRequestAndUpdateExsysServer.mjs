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
} from "../../constants.mjs";
import printRequestNetworkError from "../../helpers/printRequestNetworkError.mjs";
import postCompanyDataResponseToExsysDB from "../../helpers/postCompanyDataResponseToExsysDB.mjs";
import updateResultsFolder from "../../helpers/updateResultsFolder.mjs";

const baseApiUrl = COMPANY_API_URLS.RASD_PRODUCTION;

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

  const apiUrl = `${baseApiUrl}/${rasdApiName}`;

  try {
    const { data } = await axios.post(
      apiUrl,
      bodyData,
      companySiteRequestOptions
    );
    response = data;
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

  const { statusCode } = response || {};

  const doneFnOptions = {
    companySiteRequestOptions,
    updateTimeoutRefAndRestart,
  };

  const isInternalServerError = statusCode === 500;

  if (isInternetDisconnected || !response || isInternalServerError) {
    if (isInternetDisconnected) {
      updateTimeoutRefAndRestart();
    }

    if ((!response || isInternalServerError) && !isInternetDisconnected) {
      await onDone(doneFnOptions);
    }

    return;
  }

  const handleExsysDataAfterPost = async (
    isSuccess,
    isInternetDisconnected
  ) => {
    await updateResultsFolder({
      resultsFolderPath: RESULTS_FOLDER_PATHS[CERTIFICATE_NAMES.RASD],
      data: {
        rasdApiName,
        exsysDataSentToRasdServer: bodyData,
        rasdResponseBasedExsysData: response,
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
      apiPostData: {
        type: rasdApiName,
        data: response,
      },
      onDone: handleExsysDataAfterPost,
    });

  if (isInternetDisconnectedWhenPostingNafiesDataToExsys) {
    updateTimeoutRefAndRestart();
  }
};

export default createRasdRequestAndUpdateExsysServer;
