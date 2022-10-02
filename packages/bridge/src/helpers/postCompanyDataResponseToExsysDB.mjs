/*
 *
 * Helper: `postCompanyDataResponseToExsysDB`.
 *
 */
import axios from "axios";
import chalk from "chalk";
import { createCmdMessage } from "@exsys-server/helpers";
import createExsysApiQuery from "./createExsysApiQuery.mjs";
import printRequestNetworkError from "./printRequestNetworkError.mjs";

const postCompanyDataResponseToExsysDB = async ({
  apiId,
  apiParams,
  apiPostData,
  exsysBaseUrl,
}) => {
  const apiUrl = createExsysApiQuery({ exsysBaseUrl, apiId, apiParams });

  let response = {};
  let fetchError;
  let isInternetDisconnected = false;

  try {
    const { data } = await axios.post(apiUrl, apiPostData);
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

  const { status, error_code } = response || {};

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
        ? `just updated exsys server with data by ${coloredApiUrl}`
        : `failed to update ${coloredApiUrl} with data
          exsys error: ${chalk.red(error_code)}
        `,
    });
  }

  return {
    isInternetDisconnectedWhenPostingNafiesDataToExsys: isInternetDisconnected,
    isSuccessPostingDataToExsys: isSuccess,
    isDataSentToExsys: true,
  };
};

export default postCompanyDataResponseToExsysDB;
