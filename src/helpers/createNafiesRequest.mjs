/*
 *
 * Helper: `createNafiesRequest`.
 *
 */
import axios from "axios";
import { NAFIES_URLS } from "../constants.mjs";
import printRequestNetworkError from "./printRequestNetworkError.mjs";

const apiUrl = NAFIES_URLS.PRODUCTION;

const createNafiesRequest = async ({
  nafiesPostData,
  exsysApiCodeId,
  nafiesSiteRequestOptions,
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
    isInternetDisconnected = true;
  }

  isInternetDisconnected = printRequestNetworkError({
    fetchError,
    apiUrl,
    isInternetDisconnected,
    isPostRequest: true,
  });

  const { response: nafiesResponse } = fetchError || {};
  const { data: nafiesResponseData } = nafiesResponse || {};

  return {
    nafiesResponse: response || nafiesResponseData,
    isInternetDisconnectedWhenNafiesServerCalled: isInternetDisconnected,
    latestExsysApiCodeId: exsysApiCodeId,
  };
};

export default createNafiesRequest;
