/*
 *
 * Engine: `startWhatsAppClientsApis`.
 *
 */
import { isObjectHasData } from "@exsys-server/helpers";
import { CERTIFICATE_NAMES, RESULTS_FOLDER_PATHS } from "../../constants.mjs";
import createExsysQueryRequest from "../../helpers/createExsysQueryRequest.mjs";
import createWhatsAppRequestAndUpdateExsysServer from "./createWhatsAppRequestAndUpdateExsysServer.mjs";
import updateResultsFolder from "../../helpers/updateResultsFolder.mjs";

const { MOTTASL } = CERTIFICATE_NAMES;

const maxRestartMs = 8000;

const startWhatsAppClientsApis = async (options) => {
  const { companyName } = options;
  const resultsFolderPath = RESULTS_FOLDER_PATHS[companyName];

  try {
    const {
      updateTimeoutRefAndRestart,
      companySiteRequestOptions,
      exsysBaseUrl,
    } = options;
    const { response, isInternetDisconnected } = await createExsysQueryRequest({
      exsysBaseUrl,
      apiId: "QUERY_EXSYS_WHATSAPP_MESSAGE_DATA",
      params: {
        companyName,
      },
    });

    if (isInternetDisconnected) {
      updateTimeoutRefAndRestart();
      return;
    }

    const { authorization_Key, authorization_Value, message_id, ...bodyData } =
      response || {};

    if (
      !isObjectHasData(response) ||
      !message_id ||
      !authorization_Value ||
      !authorization_Key
    ) {
      setTimeout(
        async () => await startWhatsAppClientsApis(options),
        maxRestartMs
      );
      return;
    }

    const { localResultsData, shouldRestartServer } =
      await createWhatsAppRequestAndUpdateExsysServer({
        bodyData: bodyData,
        exsysBaseUrl,
        messageId: message_id,
        companyName,
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

    setTimeout(
      async () => await startWhatsAppClientsApis(options),
      maxRestartMs
    );
  } catch (error) {
    console.error("error", error);
    setTimeout(
      async () => await startWhatsAppClientsApis(options),
      maxRestartMs
    );
  }
};

export default startWhatsAppClientsApis;
