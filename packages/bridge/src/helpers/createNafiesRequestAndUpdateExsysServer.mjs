/*
 *
 * Helper: `createNafiesRequestAndUpdateExsysServer`.
 *
 */
import axios from "axios";
import { NAFIES_URLS } from "../constants.mjs";
import printRequestNetworkError from "./printRequestNetworkError.mjs";
import postNafiesResponseToExsysDB from "./postNafiesResponseToExsysDB.mjs";
import updateResultsFolder from "./updateResultsFolder.mjs";

const apiUrl = NAFIES_URLS.PRODUCTION;

const createNafiesRequestAndUpdateExsysServer = async ({
  nafiesPostData,
  exsysApiCodeId,
  nafiesSiteRequestOptions,
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
      nafiesSiteRequestOptions
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

  if (isInternetDisconnected || !response) {
    if (isInternetDisconnected) {
      updateTimeoutRefAndRestart();
    }

    if (!response && !isInternetDisconnected) {
      await onDone();
    }

    return;
  }

  const handleExsysDataAfterPost = async (
    isSuccess,
    isInternetDisconnected
  ) => {
    await updateResultsFolder({
      exsysApiCodeId,
      nafiesPostData,
      nafiesServerResult: response,
      successededToPostNafiesDataToExsysServer: isInternetDisconnected
        ? false
        : isSuccess,
    });

    if (!isInternetDisconnected) {
      await onDone();
    }
  };

  const {
    isInternetDisconnectedWhenPostingNafiesDataToExsys,
  } = await postNafiesResponseToExsysDB({
    exsysApiCodeId: exsysApiCodeId,
    nafiesResponse: response,
    onDone: handleExsysDataAfterPost,
  });
  if (isInternetDisconnectedWhenPostingNafiesDataToExsys) {
    updateTimeoutRefAndRestart();
  }
};

export default createNafiesRequestAndUpdateExsysServer;
