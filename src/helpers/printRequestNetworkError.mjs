/*
 *
 * Helper: `printRequestNetworkError`.
 *
 */
import chalk from "chalk";
import createCmdMessage from "./createCmdMessage.mjs";

const printRequestNetworkError = ({
  fetchError,
  apiUrl,
  isInternetDisconnected,
  isPostRequest,
}) => {
  if (fetchError) {
    const { code, response } = fetchError;
    const { status } = response || {};

    let isNotFoundApi = status === 404;

    isInternetDisconnected = code === "ENETUNREACH" && isInternetDisconnected;

    createCmdMessage({
      type: "error",
      message: `${
        isNotFoundApi
          ? "couldn't find this api"
          : `failed to ${isPostRequest ? "post data to" : "fetch"}`
      } ${chalk.magenta(apiUrl)}`,
    });
  }

  return isInternetDisconnected;
};

export default printRequestNetworkError;
