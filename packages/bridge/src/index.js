/*
 *
 * Server index file.
 *
 */
import { join } from "path";
import chalk from "chalk";
import isOnline from "is-online";
import {
  checkPathExists,
  createCmdMessage,
  findRootYarnWorkSpaces,
} from "@exsys-server/helpers";
import { createCliController } from "@exsys-server/command-line-utils";
import {
  RESTART_MS,
  CLI_OPTIONS,
  CERTIFICATE_NAMES,
  CERTIFICATE_NAMES_KEYS,
  CERTIFICATE_NAME_VALUES,
  EXSYS_DEV_BASE_URL,
} from "./constants.mjs";
import restartProcessAndPrintMessage from "./helpers/restartProcessAndPrintMessage.mjs";
import createCompanyRequestOptions from "./helpers/createCompanyRequestOptions.mjs";
import getCompanyByCertificateKey from "./helpers/getCompanyByCertificateKey.mjs";
import runNphiesEngine from "./engines/nphies/index.mjs";
import runRasdEngine from "./engines/rasd/index.mjs";
import runTadawyEngine from "./engines/tadawy/index.mjs";
import runJawalyEngine from "./engines/jawaly/index.mjs";
import runRasdXmlEngine from "./engines/rasdXml/index.mjs";
import runZohoCrmEngine from "./engines/zohoCrm/index.mjs";

const COMPANY_API_START = {
  [CERTIFICATE_NAMES.NPHIES]: runNphiesEngine,
  [CERTIFICATE_NAMES.RASD]: runRasdEngine,
  [CERTIFICATE_NAMES.TADAWY]: runTadawyEngine,
  [CERTIFICATE_NAMES.JAWALY]: runJawalyEngine,
  [CERTIFICATE_NAMES.RASD_XML]: runRasdXmlEngine,
  [CERTIFICATE_NAMES.ZOHO_CRM]: runZohoCrmEngine,
};

const runCliFn = async ({
  company,
  ignoreCert,
  production,
  exsysBaseUrl,
  devMode,
}) => {
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

  let certificatePath = undefined;

  if (!ignoreCert) {
    const rootYarnWorkSpacePath = await findRootYarnWorkSpaces();
    certificatePath = join(
      rootYarnWorkSpacePath,
      CERTIFICATE_NAME_VALUES[certificateNameKey]
    );

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

  const { IS_NPHIES_COMPANY } = getCompanyByCertificateKey(certificateNameKey);

  const companySiteRequestOptions = await createCompanyRequestOptions({
    certificatePath,
    isNphiesCompany: IS_NPHIES_COMPANY,
    ignoreCert,
  });

  const startFn = COMPANY_API_START[certificateNameKey];
  const curredExsysBaseUrl = exsysBaseUrl || EXSYS_DEV_BASE_URL;

  await startFn({
    companySiteRequestOptions,
    updateTimeoutRefAndRestart,
    isProduction: production,
    exsysBaseUrl: devMode ? curredExsysBaseUrl : exsysBaseUrl,
  });
};

createCliController({
  ...CLI_OPTIONS,
  runCliFn,
});
