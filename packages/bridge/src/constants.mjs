/*
 *
 * constants: `server`.
 *
 */
import { sharedHelperKey } from "@exsys-server/command-line-utils";

const EXSYS_BASE_URL = "http://LOCALHOST:9090/ords/exsys_api";
const EXSYS_DEV_BASE_URL = "http://149.102.140.8:9090/ords/exsys_api";
const RESTART_MS = 60000;
const RESTART_CALLING_EXSYS_QUERY_MS = 3000;

const RASD_TIME_OUT_MS = 900000; // 15 mins;

const NPHIES_CERT_FILE_NAME = "certs/Certificate_pkcs12.p12";
const RASD_CERT_FILE_NAME = "certs/rasd.cer";

const COMPANY_API_URLS = {
  NPHIES_PRODUCTION: "https://HSB.nphies.sa/$process-message",
  NPHIES_DEVELOPMENT: "http://176.105.150.83:80/$process-message",
  RASD_DEVELOPMENT: "https://api.juleb-dev.com/rasd",
  RASD_PRODUCTION: "https://api.juleb.com/rasd",
  RASD_PRODUCTION_XML: "https://rsd.sfda.gov.sa/ws",
  MOTTASL_PRODUCTION: "https://api.mottasl.com/v2/message",
  TADAWY_PRODUCTION: "https://waba-v2.360dialog.io/messages",
  TADAWY_MEDIA: "https://waba-v2.360dialog.io/media",
  JAWALY_PRODUCTION: "https://api-sms.4jawaly.com/api/v1/account/area/sms/send",
  BRCITCO_PRODUCTION: "https://www.brcitco-api.com/api/sendsms",
  // https://www.jawalbsms.ws/api.php/sendsms?user=XXXX&pass=XXXX&to=966XXXXXXX&message=XXXX&sender=XXXX
  JAWALBSMS_PRODUCTION: "https://www.jawalbsms.ws/api.php/sendsms",
  // https://api.taqnyat.sa/v1/messages?bearerTokens=ab8b66d58fcd96afdd1283cf6403f5b3&sender=Centralcare&recipients=966565658140&body=Test
  TAQNYAT_PRODUCTION: "https://api.taqnyat.sa/v1/messages",
  TAQNYAT_WHATSAPP_PRODUCTION: "https://api.taqnyat.sa/wa/v2/messages/",
};

const RESULTS_FOLDER_PATHS = {
  NPHIES: "nphies",
  JAWALY: "sms/jawaly",
  BRCITCO: "sms/brcitco",
  TAQNYAT: "sms/taqnyat",
  JAWALBSMS: "sms/jawalbsms",
  RASD: "rasd",
  RASD_XML: "rasd_xml",
  TADAWY: "tadawy",
  ZOHO_CRM: "zoho_crm",
  MOTTASL: "whatsapp/mottasl",
  TAQNYAT_WHATSAPP: "whatsapp/taqnyat",
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
  ZOHO_CRM: "ZOHO_CRM",
  MOTTASL: "MOTTASL",
  TAQNYAT: "TAQNYAT",
  TAQNYAT_WHATSAPP: "TAQNYAT_WHATSAPP",
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
      description: `point the bridge to call a company endpoints (--company=${CERTIFICATE_NAMES.RASD})`,
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
  inventory_accept_batch: "inventory_accept_batch",
  inventory_transfer_batch: "inventory_transfer_batch",
  inventory_return_batch: "inventory_return_batch",
};

export {
  EXSYS_BASE_URL,
  EXSYS_DEV_BASE_URL,
  COMPANY_API_URLS,
  RESTART_MS,
  RASD_TIME_OUT_MS,
  RESTART_CALLING_EXSYS_QUERY_MS,
  RESULTS_FOLDER_PATHS,
  CERTIFICATE_NAME_VALUES,
  CERTIFICATE_NAMES,
  RASD_API_TYPE_NAMES,
  CERTIFICATE_NAMES_KEYS,
  CLI_OPTIONS,
  RESULT_FOLDER_KEYS,
};
