/*
 *
 * Engine: `startMottaslApis`.
 *
 */
import { isObjectHasData } from "@exsys-server/helpers";
import { CERTIFICATE_NAMES, RESULTS_FOLDER_PATHS } from "../../constants.mjs";
import createExsysQueryRequest from "../../helpers/createExsysQueryRequest.mjs";
import createMottaslRequestAndUpdateExsysServer from "./createMottaslRequestAndUpdateExsysServer.mjs";
import updateResultsFolder from "../../helpers/updateResultsFolder.mjs";

const { MOTTASL } = CERTIFICATE_NAMES;

const resultsFolderPath = RESULTS_FOLDER_PATHS[MOTTASL];

const maxRestartMs = 8000;

const startMottaslApis = async (options) => {
  try {
    const {
      updateTimeoutRefAndRestart,
      companySiteRequestOptions,
      exsysBaseUrl,
    } = options;
    const { response, isInternetDisconnected } = await createExsysQueryRequest({
      exsysBaseUrl,
      apiId: "QUERY_EXSYS_TADAWY_MESSAGE_DATA",
      params: {
        companyName: MOTTASL,
      },
    });

    if (isInternetDisconnected) {
      updateTimeoutRefAndRestart();
      return;
    }

    const {
      authorization_Key,
      authorization_Value,
      message_id,
      recipient,
      channel,
      type,
      templateId,
      templateLanguage,
      templateArgs,
    } = response || {};

    if (!isObjectHasData(response) || !message_id || !templateArgs) {
      setTimeout(async () => await startMottaslApis(options), maxRestartMs);
      return;
    }

    const bodyData = {
      channel,
      recipient,
      type,
      templateId,
      templateArgs,
      templateLanguage,
    };

    const { localResultsData, shouldRestartServer } =
      await createMottaslRequestAndUpdateExsysServer({
        bodyData: bodyData,
        exsysBaseUrl,
        messageId: message_id,
        companySiteRequestOptions: {
          ...companySiteRequestOptions,
          headers: {
            ...companySiteRequestOptions.headers,
            [authorization_Key]: authorization_Value,
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

    setTimeout(async () => await startMottaslApis(options), maxRestartMs);
  } catch (error) {
    console.error("error", error);
    setTimeout(async () => await startMottaslApis(options), maxRestartMs);
  }
};

export default startMottaslApis;
