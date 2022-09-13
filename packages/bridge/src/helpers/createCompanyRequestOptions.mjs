/*
 *
 * Helper: `createCompanyRequestOptions`.
 *
 */
import { readFile } from "fs/promises";
import https from "https";

const createCompanyRequestOptions = async ({
  certificatePath,
  isNphiesCompany,
  ignoreCert,
}) => {
  const certificate = ignoreCert ? undefined : await readFile(certificatePath);

  const requestOptions = {
    headers: {
      "Content-type": !isNphiesCompany
        ? "application/json"
        : "application/fhir+json",
    },
    httpsAgent: new https.Agent({
      pfx: certificate,
      ...(!isNphiesCompany
        ? null
        : {
            passphrase: "qLFCpUS8CF_c",
          }),
    }),
  };

  return requestOptions;
};

export default createCompanyRequestOptions;
