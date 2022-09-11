/*
 *
 * Server index file.
 *
 */
import chalk from "chalk";
import isOnline from "is-online";
import { checkPathExists, createCmdMessage } from "@exsys-server/helpers";
import { createCliController } from "@exsys-server/command-line-utils";
import {
  RESTART_MS,
  CLI_OPTIONS,
  CERTIFICATE_NAMES,
  CERTIFICATE_NAMES_KEYS,
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

const runCliFn = async ({ company }) => {
  let restartTimeOutRef;

  const certificateNameKey = (company || CERTIFICATE_NAMES.RASD).toUpperCase();

  if (certificateNameKey) {
    if (!CERTIFICATE_NAMES_KEYS.includes(certificateNameKey)) {
      createCmdMessage({
        type: "error",
        message: `company name is not valid, it should be one of ${CERTIFICATE_NAMES_KEYS.join(
          " , "
        )}`,
      });
      process.exit(2);
    }
  }

  const createRestartProcessAndPrintMessage = restartProcessAndPrintMessage([
    certificateNameKey,
  ]);

  const certificatePath = createCertificatePath(certificateNameKey);
  const isCertificateFileExsist = await checkPathExists(certificatePath);

  // if (!isCertificateFileExsist) {
  // createCmdMessage({
  //   type: "error",
  //   message: `the ${chalk.magenta(
  //     "certificate"
  //   )} doesn't exist in this path ${chalk.white(
  //     certificatePath
  //   )} ${chalk.magenta(`rechecking in ${RESTART_MS / 60000} minutes.`)}`,
  // });

  //   restartTimeOutRef = createRestartProcessAndPrintMessage({
  //     restartTimeOutRef,
  //     hideNetworkMessage: true,
  //   });
  //   return;
  // }

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

createCliController({
  ...CLI_OPTIONS,
  runCliFn,
});
