/*
 *
 * Helper: `queryExsysBodyDataToCreateNafiesRequest`.
 *
 */
import chalk from "chalk";
import axios from "axios";
import { createCmdMessage } from "@exsys-server/helpers";
import createExsysApiQuery from "./createExsysApiQuery.mjs";
import printRequestNetworkError from "./printRequestNetworkError.mjs";

const queryExsysBodyDataToCreateNafiesRequest = async () => {
  const apiUrl = createExsysApiQuery("EXSYS_QUERY_NAFIES_REQUEST_BODY_DATA");
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

  const { api_pk: exsysApiCodeId, data: nafiesPostData } = response || {};
  const canCallNafiesPostApi = !!exsysApiCodeId && !!nafiesPostData;

  return {
    exsysApiCodeId,
    nafiesPostData,
    isInternetDisconnected,
    canCallNafiesPostApi,
  };
};

export default queryExsysBodyDataToCreateNafiesRequest;
