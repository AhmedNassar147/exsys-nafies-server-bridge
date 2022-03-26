/*
 *
 * Helper: `createNafiesRequestOptions`.
 *
 */
import { readFile } from "fs/promises";
import https from "https";
import { CERTIFICATE_PATH } from "../constants.mjs";

const createNafiesRequestOptions = async () => {
  // const certificate = await readFile(CERTIFICATE_PATH, {
  //   encoding: "utf8",
  // });

  const requestOptions = {
    headers: {
      "Content-type": "application/fhir+json",
    },
    httpsAgent: new https.Agent({
      pfx: "",
      passphrase: "qLFCpUS8CF_c",
    }),
  };

  return requestOptions;
};

export default createNafiesRequestOptions;
