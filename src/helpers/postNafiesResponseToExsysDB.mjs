/*
 *
 * Helper: `postNafiesResponseToExsysDB`.
 *
 */
import axios from "axios";
import chalk from "chalk";
import createExsysApiQuery from "./createExsysApiQuery.mjs";
import printRequestNetworkError from "./printRequestNetworkError.mjs";
import createCmdMessage from "./createCmdMessage.mjs";

const postNafiesResponseToExsysDB = async ({
  exsysApiCodeId,
  nafiesResponse,
  onDone,
}) => {
  const apiUrl = createExsysApiQuery("UPDATE_EXSYS_WITH_NAFIES_RESULTS", {
    api_pk: exsysApiCodeId,
  });

  let response = {};
  let fetchError;
  let isInternetDisconnected = false;

  try {
    const { data } = await axios.post(apiUrl, nafiesResponse);
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

  const coloredApiUrl = chalk.magenta(apiUrl);

  const { status } = response || {};

  if (!status) {
    createCmdMessage({
      type: "info",
      message:
        `the ${coloredApiUrl} didn't respond with \`status\`` +
        "please fix that",
    });
  }

  const isSuccess = status === "success";

  if (status) {
    createCmdMessage({
      type: isSuccess ? "success" : "error",
      message: isSuccess
        ? `just updated exsys server with nafies data by ${coloredApiUrl}`
        : `failed to update ${coloredApiUrl} with nafies data`,
    });
  }

  await onDone(isSuccess, isInternetDisconnected);

  return {
    isInternetDisconnectedWhenPostingNafiesDataToExsys: isInternetDisconnected,
  };
};

export default postNafiesResponseToExsysDB;
