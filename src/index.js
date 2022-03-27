/*
 *
 * Server index file.
 *
 */
import chalk from "chalk";
import isOnline from "is-online";
import {
  CERTIFICATE_PATH,
  RESTART_CALLING_EXSYS_QUERY_MS,
  RESTART_MS,
} from "./constants.mjs";
import restartProcessAndPrintMessage from "./helpers/restartProcessAndPrintMessage.mjs";
import createCmdMessage from "./helpers/createCmdMessage.mjs";
import checkPathExists from "./helpers/checkPathExists.mjs";
import createNafiesRequestOptions from "./helpers/createNafiesRequestOptions.mjs";
import queryExsysBodyDataToCreateNafiesRequest from "./helpers/queryExsysBodyDataToCreateNafiesRequest.mjs";
import createNafiesRequestAndUpdateExsysServer from "./helpers/createNafiesRequestAndUpdateExsysServer.mjs";

(async () => {
  let restartTimeOutRef;

  const isCertificateFileExsist = await checkPathExists(CERTIFICATE_PATH);

  if (!isCertificateFileExsist) {
    createCmdMessage({
      type: "error",
      message: `the ${chalk.magenta(
        "certificate"
      )} doesn't exist in this path ${chalk.white(
        CERTIFICATE_PATH
      )} ${chalk.magenta(`rechecking in ${RESTART_MS / 60000} minutes.`)}`,
    });

    restartTimeOutRef = restartProcessAndPrintMessage(restartTimeOutRef, true);
    return;
  }

  const isNetworkConnected = await isOnline();

  const updateTimeoutRefAndRestart = () => {
    restartTimeOutRef = restartProcessAndPrintMessage(restartTimeOutRef);
  };

  if (!isNetworkConnected) {
    updateTimeoutRefAndRestart();

    return;
  }

  if (restartTimeOutRef && restartTimeOutRef.unref) {
    restartTimeOutRef.unref();
  }

  const nafiesSiteRequestOptions = await createNafiesRequestOptions();

  const start = async () => {
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

      if (!canCallNafiesPostApi && !isInternetDisconnected) {
        setTimeout(async () => await start(), RESTART_CALLING_EXSYS_QUERY_MS);
      }

      return;
    }

    await createNafiesRequestAndUpdateExsysServer({
      nafiesPostData,
      exsysApiCodeId,
      nafiesSiteRequestOptions,
      updateTimeoutRefAndRestart,
      onDone: start,
    });
  };

  await start();
})();
