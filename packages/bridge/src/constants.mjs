/*
 *
 * constants: `server`.
 *
 */
import { sharedHelperKey } from "@exsys-server/command-line-utils";
import { readJsonFile } from "@exsys-server/helpers";

const {
  EXSYS_BASE_URL,
  EXSYS_SCHEMA_NAME,
  NPHIES_CERT_FILE_NAME,
  RASD_CERT_FILE_NAME,
  RESTART_MS,
  RESTART_CALLING_EXSYS_QUERY_MS,
  RESULTS_FOLDER_PATHS,
  COMPANY_API_URLS,
} = await readJsonFile("../../config-override.json", true);

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
      keyOrKeys: "company",
      description: `point the bridge to call a company endpoints (--company=${CERTIFICATE_NAMES.RASD.toLowerCase()})`,
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
