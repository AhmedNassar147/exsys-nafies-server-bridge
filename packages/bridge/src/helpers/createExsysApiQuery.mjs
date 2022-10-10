/*
 *
 * Helper: `queryExsysBodyDataToCreateNafiesRequest`.
 *
 */
import API_IDS from "../apiIds.mjs";
import { EXSYS_BASE_URL } from "../constants.mjs";

const createExsysApiQuery = ({ exsysBaseUrl, apiId, apiParams }) => {
  const apiIdResource = API_IDS[apiId];

  if (!apiIdResource) {
    throw new Error(`api id ${apiId} not found in /apiIds.js`);
  }

  let apiUrl = `${exsysBaseUrl || EXSYS_BASE_URL}/${apiIdResource}`;

  if (apiParams) {
    const keys = Object.keys(apiParams);
    const keysLength = keys.length;

    keys.forEach((key, index) => {
      if (!index) {
        apiUrl += "?";
      }

      const keyValue = apiParams[key];
      const isLastKey = keysLength - 1 === index;

      apiUrl += `${key}=${keyValue || ""}${isLastKey ? "" : "&"}`;
    });
  }

  return apiUrl;
};

export default createExsysApiQuery;
