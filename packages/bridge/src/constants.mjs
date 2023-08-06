/*
 *
 * constants: `server`.
 *
 */
import { sharedHelperKey } from "@exsys-server/command-line-utils";

const EXSYS_BASE_URL = "http://LOCALHOST:9090/ords/exsys_api";
const EXSYS_DEV_BASE_URL = "http://149.102.140.8:9090/ords/exsys_api";
const RESTART_MS = 60000;
const RESTART_CALLING_EXSYS_QUERY_MS = 2000;

const NPHIES_CERT_FILE_NAME = "certs/Certificate_pkcs12.p12";
const RASD_CERT_FILE_NAME = "certs/rasd.cer";

const COMPANY_API_URLS = {
  NPHIES_PRODUCTION: "https://HSB.nphies.sa/$process-message",
  NPHIES_DEVELOPMENT: "http://176.105.150.83:80/$process-message",
  RASD_DEVELOPMENT: "https://api.juleb-dev.com/rasd",
  RASD_PRODUCTION: "https://api.juleb.com/rasd",
  TADAWY_PRODUCTION: "https://waba.360dialog.io/v1/messages",
  JAWALY_PRODUCTION: "https://api-sms.4jawaly.com/api/v1/account/area/sms/send",
  BRCITCO_PRODUCTION: "https://www.brcitco-api.com/api/sendsms",
  // https://www.jawalbsms.ws/api.php/sendsms?user=XXXX&pass=XXXX&to=966XXXXXXX&message=XXXX&sender=XXXX
  JAWALBSMS_PRODUCTION: "https://www.jawalbsms.ws/api.php/sendsms",
  RASD_PRODUCTION_XML: "https://rsd.sfda.gov.sa/ws",
};

const RESULTS_FOLDER_PATHS = {
  NPHIES: "results/nphies",
  RASD: "results/rasd",
  TADAWY: "results/tadawy",
  JAWALY: "results/sms/jawaly",
  BRCITCO: "results/sms/brcitco",
  JAWALBSMS: "results/sms/jawalbsms",
  RASD_XML: "results/rasd_xml",
};

const RESULT_FOLDER_KEYS = Object.keys(RESULTS_FOLDER_PATHS);

const CERTIFICATE_NAMES = {
  NPHIES: "NPHIES",
  RASD: "RASD",
  TADAWY: "TADAWY",
  JAWALY: "JAWALY",
  JAWALBSMS: "JAWALBSMS",
  BRCITCO: "BRCITCO",
  RASD_XML: "RASD_XML",
};

const CLI_OPTIONS = {
  scriptName: "start-exsys-nphies-bridge",
  description: "a nodejs bridge to nphies, rasd and tadawy apis",
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
    {
      keyOrKeys: "dev-mode",
      description: `setup development mode (--dev-mode)`,
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
  EXSYS_DEV_BASE_URL,
  COMPANY_API_URLS,
  RESTART_MS,
  RESTART_CALLING_EXSYS_QUERY_MS,
  RESULTS_FOLDER_PATHS,
  CERTIFICATE_NAME_VALUES,
  CERTIFICATE_NAMES,
  RASD_API_TYPE_NAMES,
  CERTIFICATE_NAMES_KEYS,
  CLI_OPTIONS,
  RESULT_FOLDER_KEYS,
};
