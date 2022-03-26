/*
 *
 * Helper: `queryExsysBodyDataToCreateNafiesRequest`.
 *
 */
import API_IDS from "../apiIds.mjs";
import { EXSYS_BASE_URL, EXSYS_SCHEMA_NAME } from "../constants.mjs";

const createExsysApiQuery = (apiId) => {
  const apiIdResource = API_IDS[apiId];

  if (!apiIdResource) {
    throw new Error(`api id ${apiId} not found in /apiIds.js`);
  }

  return `${EXSYS_BASE_URL}/${EXSYS_SCHEMA_NAME}/${apiIdResource}`;
};

export default createExsysApiQuery;
