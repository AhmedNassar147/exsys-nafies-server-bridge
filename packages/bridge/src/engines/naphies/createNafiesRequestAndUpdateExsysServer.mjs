/*
 *
 * Helper: `createNafiesRequestAndUpdateExsysServer`.
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

const { NAPHIES_PRODUCTION: apiUrl } = COMPANY_API_URLS;

const createNafiesRequestAndUpdateExsysServer = async ({
  nafiesPostData,
  exsysApiCodeId,
  companySiteRequestOptions,
  updateTimeoutRefAndRestart,
  onDone,
}) => {
  let response;
  let fetchError;
  let isInternetDisconnected = false;

  try {
    const { data } = await axios.post(
      apiUrl,
      nafiesPostData,
      companySiteRequestOptions
    );
    response = data;
  } catch (apiFetchError) {
    fetchError = apiFetchError;
    const { response: nafiesResponse } = fetchError || {};
    const { data: nafiesResponseData } = nafiesResponse || {};

    if (nafiesResponseData) {
      response = nafiesResponseData;
    }
    isInternetDisconnected = true;
  }

  isInternetDisconnected = printRequestNetworkError({
    fetchError,
    apiUrl,
    isInternetDisconnected,
    isPostRequest: true,
  });

  const doneFnOptions = {
    companySiteRequestOptions,
    updateTimeoutRefAndRestart,
  };

  if (isInternetDisconnected || !response) {
    if (isInternetDisconnected) {
      updateTimeoutRefAndRestart();
    }

    if (!response && !isInternetDisconnected) {
      await onDone(doneFnOptions);
    }

    return;
  }

  const handleExsysDataAfterPost = async (
    isSuccess,
    isInternetDisconnected
  ) => {
    await updateResultsFolder({
      resultsFolderPath: RESULTS_FOLDER_PATHS[CERTIFICATE_NAMES.NAPHIES],
      data: {
        api_pk: exsysApiCodeId,
        exsysDataSentToNafiesServer: nafiesPostData,
        nafiesResponseBasedExsysData: response,
        successededToPostNafiesDataToExsysServer: isInternetDisconnected
          ? false
          : isSuccess,
      },
    });

    if (!isInternetDisconnected) {
      await onDone(doneFnOptions);
    }
  };

  const {
    isInternetDisconnectedWhenPostingNafiesDataToExsys,
  } = await postCompanyDataResponseToExsysDB({
    apiId: "UPDATE_EXSYS_WITH_NAFIES_RESULTS",
    apiPostData: response,
    apiParams: {
      api_pk: exsysApiCodeId,
    },
    onDone: handleExsysDataAfterPost,
  });
  if (isInternetDisconnectedWhenPostingNafiesDataToExsys) {
    updateTimeoutRefAndRestart();
  }
};

export default createNafiesRequestAndUpdateExsysServer;
