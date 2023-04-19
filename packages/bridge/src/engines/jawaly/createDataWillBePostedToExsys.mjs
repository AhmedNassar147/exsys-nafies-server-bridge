/*
 *
 * Helper: `createDataWillBePostedToExsys`.
 *
 */
import { CERTIFICATE_NAMES } from "../../constants.mjs";

const createDataWillBePostedToExsys =
  ({ smsSendingCompanyName, dataToSendToExsys }) =>
  ({ response, responseStatus }) => {
    switch (smsSendingCompanyName) {
      case CERTIFICATE_NAMES.JAWALY:
        const { code, message, job_id } = response || {};

        return {
          status: code || responseStatus,
          ...(dataToSendToExsys || null),
          job_id,
          error_details: job_id ? undefined : message,
        };
      case CERTIFICATE_NAMES.BRCITCO:
        return {
          response,
          ...(dataToSendToExsys || null),
          status: response === "ok" ? responseStatus : 302,
        };

      default:
        return {};
    }
  };

export default createDataWillBePostedToExsys;
