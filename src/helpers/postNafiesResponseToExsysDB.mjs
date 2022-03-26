/*
 *
 * Helper: `postNafiesResponseToExsysDB`.
 *
 */
import axios from "axios";
import createExsysApiQuery from "./createExsysApiQuery.mjs";
import printRequestNetworkError from "./printRequestNetworkError.mjs";
import createCmdMessage from "./createCmdMessage.mjs";

const postNafiesResponseToExsysDB = async ({
  exsysApiCodeId,
  nafiesResponse,
}) => {
  const apiUrl = createExsysApiQuery("UPDATE_EXSYS_WITH_NAFIES_RESULTS");

  let response = {};
  let fetchError;
  let isInternetDisconnected = false;

  const bodyData = {
    api_pk: exsysApiCodeId,
    body: nafiesResponse,
  };

  try {
    const { data } = await axios.post(apiUrl, bodyData);
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

  console.log("exsys post response", response);

  const { status } = response || {};

  if (status === "success") {
    createCmdMessage({
      type: "success",
      message: `just updated exsys server with nafies data by apiKey=${exsysApiCodeId}`,
    });
  }

  return {
    isInternetDisconnectedWhenPostingNafiesDataToExsys: isInternetDisconnected,
  };
};

export default postNafiesResponseToExsysDB;
