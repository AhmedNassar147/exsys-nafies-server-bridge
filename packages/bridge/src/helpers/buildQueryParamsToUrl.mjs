/*
 *
 * Helper: `buildQueryParamsToUrl`.
 *
 */
const buildQueryParamsToUrl = (baseApiUrl, apiParams, noParamsEncoding) => {
  let apiUrl = baseApiUrl;

  if (apiParams) {
    const keys = Object.keys(apiParams);
    const keysLength = keys.length;

    keys.forEach((key, index) => {
      if (!index) {
        apiUrl += "?";
      }

      let keyValue = apiParams[key];
      keyValue =
        typeof keyValue === "undefined"
          ? ""
          : noParamsEncoding
          ? keyValue
          : encodeURIComponent(keyValue);
      const isLastKey = keysLength - 1 === index;

      apiUrl += `${key}=${keyValue || ""}${isLastKey ? "" : "&"}`;
    });
  }

  return apiUrl;
};

export default buildQueryParamsToUrl;
