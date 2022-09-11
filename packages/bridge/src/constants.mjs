/*
 *
 * constants: `server`.
 *
 */
import { sharedHelperKey } from "@exsys-server/command-line-utils";
// 172.16.2.2
const EXSYS_BASE_URL = "http://92.205.104.231:9090/ords";
const EXSYS_SCHEMA_NAME = "exsys_api";

const CERTIFICATE_NAMES = {
  NAPHIES: "NAPHIES",
  RASD: "RASD",
};

const CLI_OPTIONS = {
  scriptName: "start-exsys-nafies-bridge",
  description: "a nodejs bridge to nphies and rasd apis",
  helpersKeys: [
    sharedHelperKey,
    {
      keyOrKeys: "company",
      description: `point the bridge to call a company endpoints (--company=${CERTIFICATE_NAMES.RASD.toLowerCase()})`,
    },
  ],
};

const CERTIFICATE_NAMES_KEYS = Object.keys(CERTIFICATE_NAMES);

const CERTIFICATE_NAME_VALUES = {
  // unique name id:  actual certificate name path
  [CERTIFICATE_NAMES.NAPHIES]: "Certificate_pkcs12.p12",
  [CERTIFICATE_NAMES.RASD]: "rasd.cer",
  // ? add another Certificate like example above
};

const BASE_CERTIFICATE_PATH = `${process.cwd()}/packages/bridge/src`;

const RESTART_MS = 60000;
const RESTART_CALLING_EXSYS_QUERY_MS = 2000;

const RASD_API_TYPE_NAMES = {
  inventory_accept: "inventory_accept",
  inventory_return: "inventory_return",
  inventory_transfer: "inventory_transfer",
  pos_sale: "pos_sale",
  pos_sale_cancel: "pos_sale_cancel",
  dispatch_info: "dispatch_info",
};

// const RASD_SITE_USER_DATA = {
//   branch_user: "68230431000010000",
//   branch_pass: "ef671ff957f38f311584464f110faa47",
// };

const COMPANY_API_URLS = {
  NAPHIES_PRODUCTION: "https://HSB.nphies.sa/$process-message",
  NAPHIES_DEVELOPMENT: "http://176.105.150.83:80/$process-message",
  RASD_PRODUCTION: "https://api.juleb-dev.com/rasd",
  // RASD_PRODUCTION: "https://api.juleb-dev.com", // development
};

const RESULTS_FOLDER_PATHS = {
  [CERTIFICATE_NAMES.NAPHIES]: `${process.cwd()}/results/naphies`,
  [CERTIFICATE_NAMES.RASD]: `${process.cwd()}/results/rasd`,
};

export {
  EXSYS_BASE_URL,
  EXSYS_SCHEMA_NAME,
  COMPANY_API_URLS,
  BASE_CERTIFICATE_PATH,
  RESTART_MS,
  RESTART_CALLING_EXSYS_QUERY_MS,
  RESULTS_FOLDER_PATHS,
  CERTIFICATE_NAME_VALUES,
  CERTIFICATE_NAMES,
  RASD_API_TYPE_NAMES,
  CERTIFICATE_NAMES_KEYS,
  CLI_OPTIONS,
  // RASD_SITE_USER_DATA,
};
