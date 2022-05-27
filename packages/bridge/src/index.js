/*
 *
 * Server index file.
 *
 */
import chalk from "chalk";
import inquirer from "inquirer";
import isOnline from "is-online";
import { checkPathExists, createCmdMessage } from "@exsys-server/helpers";
import {
  RESTART_CALLING_EXSYS_QUERY_MS,
  RESTART_MS,
  INQUIRER_QUESTIONS,
} from "./constants.mjs";
import restartProcessAndPrintMessage from "./helpers/restartProcessAndPrintMessage.mjs";
import createNafiesRequestOptions from "./helpers/createNafiesRequestOptions.mjs";
import queryExsysBodyDataToCreateNafiesRequest from "./helpers/queryExsysBodyDataToCreateNafiesRequest.mjs";
import createNafiesRequestAndUpdateExsysServer from "./helpers/createNafiesRequestAndUpdateExsysServer.mjs";
import createCertificatePath from "./helpers/createCertificatePath.mjs";

const main = async (certificateNameKey) => {
  let restartTimeOutRef;

  const createRestartProcessAndPrintMessage = restartProcessAndPrintMessage([
    certificateNameKey,
  ]);

  const certificatePath = createCertificatePath(certificateNameKey);
  const isCertificateFileExsist = await checkPathExists(certificatePath);

  if (!isCertificateFileExsist) {
    createCmdMessage({
      type: "error",
      message: `the ${chalk.magenta(
        "certificate"
      )} doesn't exist in this path ${chalk.white(
        certificatePath
      )} ${chalk.magenta(`rechecking in ${RESTART_MS / 60000} minutes.`)}`,
    });

    restartTimeOutRef = createRestartProcessAndPrintMessage({
      restartTimeOutRef,
      hideNetworkMessage: true,
    });
    return;
  }

  const isNetworkConnected = await isOnline();

  const updateTimeoutRefAndRestart = () => {
    restartTimeOutRef = createRestartProcessAndPrintMessage({
      restartTimeOutRef,
    });
  };

  if (!isNetworkConnected) {
    updateTimeoutRefAndRestart();

    return;
  }

  if (restartTimeOutRef && restartTimeOutRef.unref) {
    restartTimeOutRef.unref();
  }

  const nafiesSiteRequestOptions = await createNafiesRequestOptions(
    certificatePath
  );

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
};

(async () => {
  const processArgs = [...process.argv].slice(2);
  const [oldCertificateNameKey] = processArgs || [];
  let foundOldCertificateNameKey = oldCertificateNameKey;

  if (!foundOldCertificateNameKey) {
    const results = await inquirer.prompt(INQUIRER_QUESTIONS);
    const { certificateNameKey } = results || {};
    foundOldCertificateNameKey = certificateNameKey;
  }

  await main(foundOldCertificateNameKey);
})();
