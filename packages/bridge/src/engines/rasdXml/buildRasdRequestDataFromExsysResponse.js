/*
 *
 * Helper: `buildRasdRequestDataFromExsysResponse`.
 *
 */
import createBuildRasdRequestData from "./createBuildRasdRequestData.mjs";

const getRasdApiKeyFromString = (stringValue) =>
  stringValue.replace(/_.+/g, "");

const buildRasdRequestDataFromExsysResponse = ({
  response,
  companySiteRequestOptions,
  isProduction,
  exsysBaseUrl,
}) => {
  const { rsd_trace_type, rasdBaseRequests } = response;

  const buildRasdRequestData = createBuildRasdRequestData({
    companySiteRequestOptions,
    isProduction,
    exsysBaseUrl,
    rasdTraceType: rsd_trace_type,
  });

  let apiBaseData = [];

  for (const key in rasdBaseRequests) {
    const data = rasdBaseRequests[key];
    const rasdApiName = getRasdApiKeyFromString(key);

    apiBaseData = apiBaseData.concat(buildRasdRequestData(data, rasdApiName));
  }

  return apiBaseData.flat().filter(Boolean);
};

export default buildRasdRequestDataFromExsysResponse;
