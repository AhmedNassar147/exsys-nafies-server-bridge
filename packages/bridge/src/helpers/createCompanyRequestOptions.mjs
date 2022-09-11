/*
 *
 * Helper: `createCompanyRequestOptions`.
 *
 */
import { readFile } from "fs/promises";
import https from "https";

const createCompanyRequestOptions = async ({
  certificatePath,
  isNaphiesCompany,
}) => {
  // const certificate = await readFile(certificatePath);
  const certificate = undefined;

  const requestOptions = {
    headers: {
      "Content-type": !isNaphiesCompany
        ? "application/json"
        : "application/fhir+json",
    },
    httpsAgent: new https.Agent({
      pfx: certificate,
      ...(!isNaphiesCompany
        ? null
        : {
            passphrase: "qLFCpUS8CF_c",
          }),
    }),
  };

  return requestOptions;
};

export default createCompanyRequestOptions;
