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

    isInternetDisconnected = code === "ENETUNREACH" && isInternetDisconnected;

    const { status, data } = response || {};

    if (data && isPostRequest) {
      return isInternetDisconnected;
    }

    let isNotFoundApi = status === 404;

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
