/*
 *
 * constants: `server`.
 *
 */
const EXSYS_BASE_URL = "http://207.180.237.36:9090/ords";
const EXSYS_SCHEMA_NAME = "exsys_api";

const CERTIFICATE_NAME = "Certificate_pkcs12.p12";
const CERTIFICATE_PATH = `./${CERTIFICATE_NAME}`;

const RESTART_MS = 60000;

const NAFIES_URLS = {
  PRODUCTION: "https://HSB.nphies.sa/$process-message",
  DEVELOPMENT: "http://176.105.150.83:80/$process-message",
};

export {
  EXSYS_BASE_URL,
  EXSYS_SCHEMA_NAME,
  NAFIES_URLS,
  CERTIFICATE_PATH,
  RESTART_MS,
};
