/*
 *
 * Server index file.
 *
 */
import chalk from "chalk";
import isOnline from "is-online";
import { CERTIFICATE_PATH } from "./constants.mjs";
import restartProcessAndPrintMessage from "./helpers/restartProcessAndPrintMessage.mjs";
import createCmdMessage from "./helpers/createCmdMessage.mjs";
import checkPathExists from "./helpers/checkPathExists.mjs";
import createNafiesRequestOptions from "./helpers/createNafiesRequestOptions.mjs";
import queryExsysBodyDataToCreateNafiesRequest from "./helpers/queryExsysBodyDataToCreateNafiesRequest.mjs";
import createNafiesRequest from "./helpers/createNafiesRequest.mjs";
import postNafiesResponseToExsysDB from "./helpers/postNafiesResponseToExsysDB.mjs";

(async () => {
  let restartTimeOutRef;

  const isCertificateFileExsist = await checkPathExists(CERTIFICATE_PATH);

  if (!isCertificateFileExsist) {
    createCmdMessage({
      type: "error",
      message: `the "certificate" doesn't exist in this path ${chalk.white(
        CERTIFICATE_PATH
      )}`,
    });

    process.exit(1);
  }

  const updateTimeoutRefAndRestart = () => {
    restartTimeOutRef = restartProcessAndPrintMessage(restartTimeOutRef);
  };

  const isNetworkConnected = await isOnline();

  if (!isNetworkConnected) {
    updateTimeoutRefAndRestart();

    return;
  }

  if (restartTimeOutRef && restartTimeOutRef.unref) {
    restartTimeOutRef.unref();
  }

  const nafiesSiteRequestOptions = await createNafiesRequestOptions();

  setInterval(async () => {
    const {
      exsysApiCodeId,
      nafiesPostData,
      isInternetDisconnected,
      canCallNafiesPostApi,
    } = await queryExsysBodyDataToCreateNafiesRequest();

    if (isInternetDisconnected || !canCallNafiesPostApi) {
      if (isInternetDisconnected) {
        updateTimeoutRefAndRestart();
      }

      return;
    }

    const {
      isInternetDisconnectedWhenNafiesServerCalled,
      latestExsysApiCodeId,
      nafiesResponse,
    } = await createNafiesRequest({
      nafiesPostData,
      exsysApiCodeId,
      nafiesSiteRequestOptions,
    });

    if (isInternetDisconnectedWhenNafiesServerCalled || !nafiesResponse) {
      if (isInternetDisconnectedWhenNafiesServerCalled) {
        updateTimeoutRefAndRestart();
      }

      return;
    }

    const {
      isInternetDisconnectedWhenPostingNafiesDataToExsys,
    } = await postNafiesResponseToExsysDB({
      exsysApiCodeId: latestExsysApiCodeId,
      nafiesResponse,
    });

    if (isInternetDisconnectedWhenPostingNafiesDataToExsys) {
      updateTimeoutRefAndRestart();
    }
  }, 4000);
})();
