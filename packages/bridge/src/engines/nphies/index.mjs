/*
 *
 * Engine: `startNphiesApis`.
 *
 */
import createNafiesRequestAndUpdateExsysServer from "./createNphiesRequestAndUpdateExsysServer.mjs";
import createExsysQueryRequest from "../../helpers/createExsysQueryRequest.mjs";
import { RESTART_CALLING_EXSYS_QUERY_MS } from "../../constants.mjs";

const startNphiesApis = async (options) => {
  const { updateTimeoutRefAndRestart, companySiteRequestOptions } = options;
  const { response, isInternetDisconnected } = await createExsysQueryRequest({
    apiId: "QUERY_EXSYS_NAFIES_REQUEST_BODY_DATA",
  });

  const { api_pk: exsysApiCodeId, data: nphiesPostData } = response;
  const canCallNafiesPostApi = !!exsysApiCodeId && !!nphiesPostData;

  if (isInternetDisconnected || !canCallNafiesPostApi) {
    if (isInternetDisconnected) {
      updateTimeoutRefAndRestart();
    }

    if (!canCallNafiesPostApi && !isInternetDisconnected) {
      setTimeout(
        async () => await startNphiesApis(options),
        RESTART_CALLING_EXSYS_QUERY_MS
      );
    }

    return;
  }

  await createNafiesRequestAndUpdateExsysServer({
    nphiesPostData,
    exsysApiCodeId,
    companySiteRequestOptions,
    updateTimeoutRefAndRestart,
    onDone: startNphiesApis,
  });
};

export default startNphiesApis;
