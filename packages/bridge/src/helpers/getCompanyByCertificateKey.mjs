/*
 *
 * Helper: `getCompanyByCertificateKey`.
 *
 */
import { CERTIFICATE_NAMES } from "../constants.mjs";

const getCompanyByCertificateKey = (certificateNameKey) => ({
  IS_RASD_COMPANY: CERTIFICATE_NAMES.RASD === certificateNameKey,
  IS_NPHIES_COMPANY: CERTIFICATE_NAMES.NPHIES === certificateNameKey,
});

export default getCompanyByCertificateKey;
