/*
 *
 * constants: `server`.
 *
 */
import { sharedHelperKey } from "@exsys-server/command-line-utils";

const EXSYS_BASE_URL = "http://LOCALHOST:9090/ords";
const EXSYS_SCHEMA_NAME = "exsys_api";
const RESTART_MS = 60000;
const RESTART_CALLING_EXSYS_QUERY_MS = 2000;

const NPHIES_CERT_FILE_NAME = "certs/Certificate_pkcs12.p12";
const RASD_CERT_FILE_NAME = "certs/rasd.cer";

const COMPANY_API_URLS = {
  NPHIES_PRODUCTION: "https://HSB.nphies.sa/$process-message",
  NPHIES_DEVELOPMENT: "http://176.105.150.83:80/$process-message",
  RASD_DEVELOPMENT: "https://api.juleb-dev.com/rasd",
  RASD_PRODUCTION: "https://api.juleb.com/rasd",
};

const RESULTS_FOLDER_PATHS = {
  NPHIES: "results/nphies",
  RASD: "results/rasd",
};

const CERTIFICATE_NAMES = {
  NPHIES: "NPHIES",
  RASD: "RASD",
};

const CLI_OPTIONS = {
  scriptName: "start-exsys-nphies-bridge",
  description: "a nodejs bridge to nphies and rasd apis",
  helpersKeys: [
    sharedHelperKey,
    {
      keyOrKeys: "exsys-base-url",
      description: `point the bridge to call a the exsys base endpoints url (--exsys-base-url=${EXSYS_BASE_URL})`,
    },
    {
      keyOrKeys: "company",
      description: `point the bridge to call a company endpoints (--company=${CERTIFICATE_NAMES.RASD.toLowerCase()})`,
    },
    {
      keyOrKeys: "production",
      description: `point the bridge to call a company endpoints in production mode (--production)`,
    },
    {
      keyOrKeys: "ignore-cert",
      description: `ignore certification for current company (--ignore-cert)`,
    },
  ],
};

const CERTIFICATE_NAMES_KEYS = Object.keys(CERTIFICATE_NAMES);

const CERTIFICATE_NAME_VALUES = {
  // unique name id:  actual certificate name path
  [CERTIFICATE_NAMES.NPHIES]: NPHIES_CERT_FILE_NAME,
  [CERTIFICATE_NAMES.RASD]: RASD_CERT_FILE_NAME,
  // ? add another Certificate like example above
};

const RASD_API_TYPE_NAMES = {
  inventory_accept: "inventory_accept",
  inventory_return: "inventory_return",
  inventory_transfer: "inventory_transfer",
  pos_sale: "pos_sale",
  pos_sale_cancel: "pos_sale_cancel",
  dispatch_info: "dispatch_info",
};

export {
  EXSYS_BASE_URL,
  EXSYS_SCHEMA_NAME,
  COMPANY_API_URLS,
  RESTART_MS,
  RESTART_CALLING_EXSYS_QUERY_MS,
  RESULTS_FOLDER_PATHS,
  CERTIFICATE_NAME_VALUES,
  CERTIFICATE_NAMES,
  RASD_API_TYPE_NAMES,
  CERTIFICATE_NAMES_KEYS,
  CLI_OPTIONS,
};
