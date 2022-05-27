/*
 *
 * Helper: `createCertificatePath`.
 *
 */
import { join } from "path";
import {
  BASE_CERTIFICATE_PATH,
  CERTIFICATE_NAME_VALUES,
} from "../constants.mjs";

const createCertificatePath = (certificateNameKey) => {
  const certificateName = CERTIFICATE_NAME_VALUES[certificateNameKey];

  return join(BASE_CERTIFICATE_PATH, certificateName);
};

export default createCertificatePath;
