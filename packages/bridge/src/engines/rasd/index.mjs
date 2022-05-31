/*
 *
 * Engine: `startRasdApis`.
 *
 */
import createRasdRequestAndUpdateExsysServer from "./createRasdRequestAndUpdateExsysServer.mjs";
import createExsysQueryRequest from "../../helpers/createExsysQueryRequest.mjs";
import {
  RESTART_CALLING_EXSYS_QUERY_MS,
  RASD_API_TYPE_NAMES,
} from "../../constants.mjs";

const startRasdApis = async (options) => {
  const { updateTimeoutRefAndRestart, companySiteRequestOptions } = options;
  const { response, isInternetDisconnected } = await createExsysQueryRequest({
    apiId: "QUERY_EXSYS_RASD_REQUEST_DATA",
  });

  const { type, bodyData } = response;
  const rasdApiName = RASD_API_TYPE_NAMES[type];

  if (isInternetDisconnected || !rasdApiName || !bodyData) {
    if (isInternetDisconnected) {
      updateTimeoutRefAndRestart();
    }

    if ((!rasdApiName || !bodyData) && !isInternetDisconnected) {
      setTimeout(
        async () => await startRasdApis(options),
        RESTART_CALLING_EXSYS_QUERY_MS
      );
    }

    return;
  }

  await createRasdRequestAndUpdateExsysServer({
    rasdApiName,
    bodyData,
    companySiteRequestOptions,
    updateTimeoutRefAndRestart,
    onDone: startRasdApis,
  });
};

export default startRasdApis;
