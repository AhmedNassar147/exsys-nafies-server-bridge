/*
 *
 * Helper: `getCompanyByCertificateKey`.
 *
 */
import { CERTIFICATE_NAMES } from "../constants.mjs";

const getCompanyByCertificateKey = (certificateNameKey) => ({
  IS_RASD_COMPANY: CERTIFICATE_NAMES.RASD === certificateNameKey,
  IS_NAPHIES_COMPANY: CERTIFICATE_NAMES.NAPHIES === certificateNameKey,
});

export default getCompanyByCertificateKey;
