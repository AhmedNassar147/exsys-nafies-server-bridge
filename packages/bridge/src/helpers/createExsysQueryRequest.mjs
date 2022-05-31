/*
 *
 * Helper: `createExsysQueryRequest`.
 *
 */
import chalk from "chalk";
import axios from "axios";
import { createCmdMessage } from "@exsys-server/helpers";
import createExsysApiQuery from "./createExsysApiQuery.mjs";
import printRequestNetworkError from "./printRequestNetworkError.mjs";

const createExsysQueryRequest = async ({ apiId, params }) => {
  const apiUrl = createExsysApiQuery(apiId, params);
  let response = {};
  let fetchError;
  let isInternetDisconnected = false;

  createCmdMessage({
    type: "info",
    message: `fetching  ${chalk.green(apiUrl)}`,
  });

  try {
    const { data } = await axios.get(apiUrl);
    response = data;
  } catch (apiFetchError) {
    fetchError = apiFetchError;
    isInternetDisconnected = true;
  }

  isInternetDisconnected = printRequestNetworkError({
    fetchError,
    apiUrl,
    isInternetDisconnected,
  });

  return {
    response: response || {},
    fetchError,
    isInternetDisconnected,
  };
};

export default createExsysQueryRequest;
