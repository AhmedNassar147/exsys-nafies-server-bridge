/*
 *
 * Helper: `queryExsysBodyDataToCreateNafiesRequest`.
 *
 */
import axios from "axios";
import chalk from "chalk";
import createExsysApiQuery from "./createExsysApiQuery.mjs";
import printRequestNetworkError from "./printRequestNetworkError.mjs";
import createCmdMessage from "./createCmdMessage.mjs";

const queryExsysBodyDataToCreateNafiesRequest = async () => {
  const apiUrl = createExsysApiQuery("EXSYS_QUERY_NAFIES_REQUEST_BODY_DATA");
  let response = {};
  let fetchError;
  let isInternetDisconnected = false;

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

  if (!canCallNafiesPostApi) {
    createCmdMessage({
      type: "info",
      message: `won't call nafies post \`API\` because I couldn't find ${chalk.green(
        `\`api_pk\` or \`data\``
      )} from ${chalk.green(apiUrl)} `,
    });
  }

  return {
    exsysApiCodeId,
    nafiesPostData,
    isInternetDisconnected,
    canCallNafiesPostApi,
  };
};

export default queryExsysBodyDataToCreateNafiesRequest;
