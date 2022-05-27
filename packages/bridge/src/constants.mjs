/*
 *
 * constants: `server`.
 *
 */
const EXSYS_BASE_URL = "http://172.16.2.3:9090/ords";
const EXSYS_SCHEMA_NAME = "exsys_api";

const CERTIFICATE_NAME_VALUES = {
  Certificate_pkcs12: "Certificate_pkcs12.p12",
  // ? add another Certificate like example above
};

const CERTIFICATE_NAME_OPTIONS = Object.keys(CERTIFICATE_NAME_VALUES);

const BASE_CERTIFICATE_PATH = `${process.cwd()}/packages/bridge/src`;

const RESTART_MS = 60000;
const RESTART_CALLING_EXSYS_QUERY_MS = 2000;

const NAFIES_URLS = {
  PRODUCTION: "https://HSB.nphies.sa/$process-message",
  DEVELOPMENT: "http://176.105.150.83:80/$process-message",
};

const RESULTS_FOLDER_PATH = `${process.cwd()}/results`;

const INQUIRER_QUESTIONS = {
  type: "rawlist",
  name: "certificateNameKey",
  message: "Select certificate",
  choices: CERTIFICATE_NAME_OPTIONS,
  validate(answer) {
    return answer.length < 1
      ? "You must choose at least one certificate."
      : true;
  },
};

export {
  EXSYS_BASE_URL,
  EXSYS_SCHEMA_NAME,
  NAFIES_URLS,
  BASE_CERTIFICATE_PATH,
  RESTART_MS,
  RESTART_CALLING_EXSYS_QUERY_MS,
  RESULTS_FOLDER_PATH,
  INQUIRER_QUESTIONS,
  CERTIFICATE_NAME_VALUES,
};
