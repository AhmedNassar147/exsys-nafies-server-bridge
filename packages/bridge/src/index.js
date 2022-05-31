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
  RESTART_MS,
  INQUIRER_QUESTIONS,
  CERTIFICATE_NAMES,
} from "./constants.mjs";
import restartProcessAndPrintMessage from "./helpers/restartProcessAndPrintMessage.mjs";
import createCompanyRequestOptions from "./helpers/createCompanyRequestOptions.mjs";
import createCertificatePath from "./helpers/createCertificatePath.mjs";
import getCompanyByCertificateKey from "./helpers/getCompanyByCertificateKey.mjs";
import startNaphiesApis from "./engines/naphies/index.mjs";
import startRasdApis from "./engines/rasd/index.mjs";

const COMPANY_API_START = {
  [CERTIFICATE_NAMES.NAPHIES]: startNaphiesApis,
  [CERTIFICATE_NAMES.RASD]: startRasdApis,
};

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

  const { IS_NAPHIES_COMPANY } = getCompanyByCertificateKey(certificateNameKey);

  const companySiteRequestOptions = await createCompanyRequestOptions({
    certificatePath,
    isNaphiesCompany: IS_NAPHIES_COMPANY,
  });

  const startFn = COMPANY_API_START[certificateNameKey];

  await startFn({
    companySiteRequestOptions,
    updateTimeoutRefAndRestart,
  });
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

  await main(foundOldCertificateNameKey || COMPANY_API_START.NAPHIES);
})();
