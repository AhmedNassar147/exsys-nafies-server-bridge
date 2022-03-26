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
}) => {
  let apiUrl = createExsysApiQuery("UPDATE_EXSYS_WITH_NAFIES_RESULTS");
  apiUrl = `${apiUrl}?api_pk=${exsysApiCodeId}`;

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

  const { status } = response || {};

  if (status === "success") {
    createCmdMessage({
      type: "success",
      message: `just updated exsys server with nafies data by ${chalk.magenta(
        apiUrl
      )}`,
    });
  }

  if (status === "failure") {
    createCmdMessage({
      type: "error",
      message: `failed to update ${chalk.magenta(apiUrl)}`,
    });
  }

  return {
    isInternetDisconnectedWhenPostingNafiesDataToExsys: isInternetDisconnected,
  };
};

export default postNafiesResponseToExsysDB;
