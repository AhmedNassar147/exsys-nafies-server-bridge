/*
 *
 * Helper: `createQueryRequest`.
 *
 */
import chalk from "chalk";
import axios from "axios";
import { createCmdMessage } from "@exsys-server/helpers";
import buildQueryParamsToUrl from "./buildQueryParamsToUrl.mjs";
import printRequestNetworkError from "./printRequestNetworkError.mjs";

const createQueryRequest = async ({ baseApiUrl, params, noParamsEncoding }) => {
  const apiUrl = buildQueryParamsToUrl(baseApiUrl, params, noParamsEncoding);

  let response = {};
  let fetchError;
  let responseStatus;
  let isInternetDisconnected = false;

  createCmdMessage({
    type: "info",
    message: `fetching  ${chalk.green(apiUrl)}`,
  });

  try {
    const { data, status } = await axios.get(apiUrl);
    response = data;
    responseStatus = status;
  } catch (apiFetchError) {
    fetchError = apiFetchError;
    const { response: nafiesResponse } = fetchError || {};
    const { data: nafiesResponseData } = nafiesResponse || {};

    response = nafiesResponseData;
    isInternetDisconnected = true;
  }

  isInternetDisconnected = printRequestNetworkError({
    fetchError,
    apiUrl,
    isInternetDisconnected,
  });

  return {
    response: response || {},
    responseStatus,
    fetchError,
    isInternetDisconnected,
  };
};

export default createQueryRequest;
