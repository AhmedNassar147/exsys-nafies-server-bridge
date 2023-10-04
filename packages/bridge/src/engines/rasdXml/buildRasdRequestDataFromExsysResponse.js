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
  const buildRasdRequestData = createBuildRasdRequestData({
    companySiteRequestOptions,
    isProduction,
    exsysBaseUrl,
  });

  let apiBaseData = [];

  for (const key in response) {
    const data = response[key];
    const rasdApiName = getRasdApiKeyFromString(key);

    apiBaseData = apiBaseData.concat(buildRasdRequestData(data, rasdApiName));
  }

  return apiBaseData.flat().filter(Boolean);
};

export default buildRasdRequestDataFromExsysResponse;
