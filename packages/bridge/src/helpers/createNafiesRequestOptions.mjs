/*
 *
 * Helper: `createNafiesRequestOptions`.
 *
 */
import { readFile } from "fs/promises";
import https from "https";

const createNafiesRequestOptions = async (certificatePath) => {
  const certificate = await readFile(certificatePath);

  const requestOptions = {
    headers: {
      "Content-type": "application/fhir+json",
    },
    httpsAgent: new https.Agent({
      pfx: certificate,
      passphrase: "qLFCpUS8CF_c",
    }),
  };

  return requestOptions;
};

export default createNafiesRequestOptions;
