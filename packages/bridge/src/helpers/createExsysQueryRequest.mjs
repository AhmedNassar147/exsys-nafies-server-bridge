/*
 *
 * Helper: `createExsysQueryRequest`.
 *
 */
import createQueryRequest from "./createQueryRequest.mjs";
import createExsysApiQuery from "./createExsysApiQuery.mjs";

const createExsysQueryRequest = async ({ exsysBaseUrl, apiId, params }) => {
  return createQueryRequest({
    baseApiUrl: createExsysApiQuery({
      exsysBaseUrl,
      apiId,
      apiParams: params,
    }),
  });
};

export default createExsysQueryRequest;
