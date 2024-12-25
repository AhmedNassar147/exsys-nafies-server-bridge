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
      case CERTIFICATE_NAMES.JAWALBSMS:
        return {
          response,
          ...(dataToSendToExsys || null),
          status: (response || "").toString().includes("STATUS: Success")
            ? responseStatus
            : 302,
        };

      case CERTIFICATE_NAMES.TAQNYAT:
        const {
          statusCode,
          message: apiMessage,
          // messageId,
          // cost,
          // currency,
          // totalCount,
          // msgLength,
          // accepted,
          // rejected,
        } = response || {};

        // {
        //   "statusCode": 201,
        //   "messageId": 6937614257,
        //   "cost": "0.0500",
        //   "currency": "SAR",
        //   "totalCount": 1,
        //   "msgLength": 1,
        //   "accepted": "[966565658140,]",
        //   "rejected": "[]"
        // }

        return {
          status: statusCode || responseStatus,
          error_details: apiMessage,
          ...(dataToSendToExsys || null),
        };

      case CERTIFICATE_NAMES.MORA_SA:
        const { status: statusObject, data: dataObject } = response || {};

        const {
          code: _code,
          message: statusMessage,
          error: isError,
        } = statusObject || {};

        const {
          code: dataCode,
          message: dataMessage,
          ref_id,
        } = dataObject || {};

        return {
          status: _code || responseStatus,
          statusMessage,
          dataMessage,
          dataCode,
          ref_id,
          error_details: isError ? statusMessage : undefined,
          ...(dataToSendToExsys || null),
        };

      default:
        return {};
    }
  };

export default createDataWillBePostedToExsys;
