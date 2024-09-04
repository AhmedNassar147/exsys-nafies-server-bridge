/*
 *
 * Helper: `createBuildRasdRequestData`.
 *
 */
import RASD_REQUESTS_XML_TEMP from "./createRasdApisXml.mjs";
import createDispatchInfoProperResponseFromParsedXml from "./xmlResponseTransformers/createDispatchInfoProperResponseFromParsedXml.mjs";

const createBuildRasdRequestData =
  ({ companySiteRequestOptions, isProduction, exsysBaseUrl, rasdTraceType }) =>
  (data, rasdApiName) => {
    if (!data || !data.length) {
      return [];
    }

    return data.map((exsysData) => {
      const { userName, password, ...options } = exsysData;

      return {
        rasdApiName,
        isProduction,
        exsysBaseUrl,
        exsysData,
        rasdTraceType,
        companySiteRequestOptions: {
          ...companySiteRequestOptions,
          headers: {
            ...companySiteRequestOptions.headers,
            "Content-type": "text/xml",
          },
          auth: {
            username: userName,
            password: password,
          },
        },
        jsonFromXmlBodyTransformer:
          createDispatchInfoProperResponseFromParsedXml(exsysData),
        bodyData: RASD_REQUESTS_XML_TEMP[rasdApiName]({
          ...options,
          rasdApiName,
        }),
      };
    });
  };

export default createBuildRasdRequestData;
