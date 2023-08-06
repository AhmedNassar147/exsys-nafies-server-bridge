/*
 *
 * Helper: `getDataFromResponse`.
 *
 */
import {
  RESULTS_FOLDER_PATHS,
  RESULT_FOLDER_KEYS,
  CERTIFICATE_NAMES,
  COMPANY_API_URLS,
} from "../../constants.mjs";

const { JAWALY_PRODUCTION, BRCITCO_PRODUCTION, JAWALBSMS_PRODUCTION } =
  COMPANY_API_URLS;

const getDataFromResponse = ({
  sms_sending_company_name,
  message_id,
  ...response
} = {}) => {
  const resultsFolderPath = RESULTS_FOLDER_PATHS[sms_sending_company_name];

  const baseRestartIf =
    !sms_sending_company_name ||
    !RESULT_FOLDER_KEYS.includes(sms_sending_company_name);

  const dataToSendToExsys = {
    message_id,
  };

  switch (sms_sending_company_name) {
    case CERTIFICATE_NAMES.JAWALY:
      const { api_key, api_secret, sms_body } = response;
      const { messages } = sms_body || {};

      return {
        restartIf:
          baseRestartIf ||
          !messages ||
          !messages.length ||
          !api_key ||
          !api_secret ||
          !message_id,
        resultsFolderPath,
        smsSendingCompanyName: sms_sending_company_name,
        printNoCompanyProvided: baseRestartIf,
        requestDataParamsOrBody: sms_body,
        companyApiUrl: JAWALY_PRODUCTION,
        dataToSendToExsys,
        companySiteRequestOptionsAuth: {
          username: api_key,
          password: api_secret,
        },
      };

    case CERTIFICATE_NAMES.JAWALBSMS:
    case CERTIFICATE_NAMES.BRCITCO:
      const { user, pass, to, sender, message } = response;
      const isJawalbsms =
        sms_sending_company_name === CERTIFICATE_NAMES.JAWALBSMS;

      return {
        restartIf:
          baseRestartIf ||
          !message ||
          !sender ||
          !to ||
          !pass ||
          !user ||
          !message_id,
        resultsFolderPath,
        smsSendingCompanyName: sms_sending_company_name,
        printNoCompanyProvided: baseRestartIf,
        companyApiUrl: isJawalbsms ? JAWALBSMS_PRODUCTION : BRCITCO_PRODUCTION,
        isCompanyQueryPostByQueryFetch: true,
        dataToSendToExsys,
        requestDataParamsOrBody: {
          user,
          pass,
          to,
          sender,
          message,
        },
        companySiteRequestOptionsAuth: undefined,
      };

    default:
      return undefined;
  }
};

export default getDataFromResponse;
