/*
 *
 * Engine: `startJawalyApis`.
 *
 */
import {
  CERTIFICATE_NAMES,
  RESULTS_FOLDER_PATHS,
  RESTART_CALLING_EXSYS_QUERY_MS,
} from "../../constants.mjs";
import createJawalyRequestAndUpdateExsysServer from "./createJawalyRequestAndUpdateExsysServer.mjs";
import createExsysQueryRequest from "../../helpers/createExsysQueryRequest.mjs";
import updateResultsFolder from "../../helpers/updateResultsFolder.mjs";

const resultsFolderPath = RESULTS_FOLDER_PATHS[CERTIFICATE_NAMES.JAWALY];

const startJawalyApis = async (options) => {
  try {
    const {
      updateTimeoutRefAndRestart,
      companySiteRequestOptions,
      isProduction,
      exsysBaseUrl,
    } = options;

    const { response, isInternetDisconnected } = await createExsysQueryRequest({
      exsysBaseUrl,
      apiId: "QUERY_EXSYS_JAWALY_MESSAGE_DATA",
    });

    if (isInternetDisconnected) {
      updateTimeoutRefAndRestart();
      return;
    }

    const { api_key, api_secret, message_id, sms_body } = response || {};
    const { messages } = sms_body || {};

    if (!messages || !messages.length || !api_key || !api_secret) {
      setTimeout(
        async () => await startJawalyApis(options),
        RESTART_CALLING_EXSYS_QUERY_MS
      );

      return;
    }

    const { localResultsData, shouldRestartServer } =
      await createJawalyRequestAndUpdateExsysServer({
        message_id,
        bodyData: sms_body,
        isProduction,
        exsysBaseUrl,
        companySiteRequestOptions: {
          ...companySiteRequestOptions,
          auth: {
            username: api_key,
            password: api_secret,
          },
        },
      });

    await updateResultsFolder({
      resultsFolderPath,
      data: localResultsData,
    });

    if (shouldRestartServer) {
      updateTimeoutRefAndRestart();
      return;
    }

    await startJawalyApis(options);
  } catch (error) {
    console.error("error", error);
    setTimeout(
      async () => await startJawalyApis(options),
      RESTART_CALLING_EXSYS_QUERY_MS
    );
  }
};

export default startJawalyApis;
