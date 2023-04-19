/*
 *
 * Helper: `queryExsysBodyDataToCreateNafiesRequest`.
 *
 */
import API_IDS from "../apiIds.mjs";
import { EXSYS_BASE_URL } from "../constants.mjs";
import buildQueryParamsToUrl from "./buildQueryParamsToUrl.mjs";

const createExsysApiQuery = ({ exsysBaseUrl, apiId, apiParams }) => {
  const apiIdResource = API_IDS[apiId];

  if (!apiIdResource) {
    throw new Error(`api id ${apiId} not found in /apiIds.js`);
  }

  const apiUrl = `${exsysBaseUrl || EXSYS_BASE_URL}/${apiIdResource}`;

  return buildQueryParamsToUrl(apiUrl, apiParams);
};

export default createExsysApiQuery;
