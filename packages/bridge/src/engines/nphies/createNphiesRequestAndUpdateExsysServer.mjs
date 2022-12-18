/*
 *
 * Helper: `createNphiesRequestAndUpdateExsysServer`.
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

const { NPHIES_PRODUCTION: apiUrl } = COMPANY_API_URLS;

const createNphiesRequestAndUpdateExsysServer = async ({
  nphiesPostData,
  exsysApiCodeId,
  companySiteRequestOptions,
  updateTimeoutRefAndRestart,
  onDone,
  exsysBaseUrl,
}) => {
  let response;
  let fetchError;
  let isInternetDisconnected = false;

  try {
    const { data } = await axios.post(
      apiUrl,
      nphiesPostData,
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

  const {
    isInternetDisconnectedWhenPostingDataToExsys,
    isSuccessPostingDataToExsys,
    isDataSentToExsys,
  } = await postCompanyDataResponseToExsysDB({
    apiId: "UPDATE_EXSYS_WITH_NAFIES_RESULTS",
    apiPostData: response,
    exsysBaseUrl,
    apiParams: {
      api_pk: exsysApiCodeId,
    },
  });

  await updateResultsFolder({
    resultsFolderPath: RESULTS_FOLDER_PATHS[CERTIFICATE_NAMES.NPHIES],
    data: {
      api_pk: exsysApiCodeId,
      isNphiesDataSentToExsys: isDataSentToExsys,
      exsysDataSentToNafiesServer: nphiesPostData,
      nafiesResponseBasedExsysData: response,
      successededToPostNafiesDataToExsysServer: isInternetDisconnected
        ? false
        : isSuccessPostingDataToExsys,
    },
  });

  if (isInternetDisconnectedWhenPostingDataToExsys) {
    updateTimeoutRefAndRestart();
    return;
  }

  if (isSuccessPostingDataToExsys) {
    await onDone(doneFnOptions);
  }
};

export default createNphiesRequestAndUpdateExsysServer;
