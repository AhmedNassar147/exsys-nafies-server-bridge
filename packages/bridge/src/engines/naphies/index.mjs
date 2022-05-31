/*
 *
 * Engine: `startNaphiesApis`.
 *
 */
import createNafiesRequestAndUpdateExsysServer from "./createNafiesRequestAndUpdateExsysServer.mjs";
import createExsysQueryRequest from "../../helpers/createExsysQueryRequest.mjs";
import { RESTART_CALLING_EXSYS_QUERY_MS } from "../../constants.mjs";

const startNaphiesApis = async (options) => {
  const { updateTimeoutRefAndRestart, companySiteRequestOptions } = options;
  const { response, isInternetDisconnected } = await createExsysQueryRequest({
    apiId: "QUERY_EXSYS_NAFIES_REQUEST_BODY_DATA",
  });

  const { api_pk: exsysApiCodeId, data: nafiesPostData } = response;
  const canCallNafiesPostApi = !!exsysApiCodeId && !!nafiesPostData;

  if (isInternetDisconnected || !canCallNafiesPostApi) {
    if (isInternetDisconnected) {
      updateTimeoutRefAndRestart();
    }

    if (!canCallNafiesPostApi && !isInternetDisconnected) {
      setTimeout(
        async () => await startNaphiesApis(options),
        RESTART_CALLING_EXSYS_QUERY_MS
      );
    }

    return;
  }

  await createNafiesRequestAndUpdateExsysServer({
    nafiesPostData,
    exsysApiCodeId,
    companySiteRequestOptions,
    updateTimeoutRefAndRestart,
    onDone: startNaphiesApis,
  });
};

export default startNaphiesApis;
