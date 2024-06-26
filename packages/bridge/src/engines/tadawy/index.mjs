/*
 *
 * Engine: `startTadawyApis`.
 *
 */
import { isArrayHasData, isObjectHasData } from "@exsys-server/helpers";
import { CERTIFICATE_NAMES, RESULTS_FOLDER_PATHS } from "../../constants.mjs";
import makeUploadFileRequest from "./makeUploadFileRequest.mjs";
import createTadawyRequestAndUpdateExsysServer from "./createTadawyRequestAndUpdateExsysServer.mjs";
import createExsysQueryRequest from "../../helpers/createExsysQueryRequest.mjs";
import updateResultsFolder from "../../helpers/updateResultsFolder.mjs";

const { TADAWY } = CERTIFICATE_NAMES;

const resultsFolderPath = RESULTS_FOLDER_PATHS[TADAWY];

const restartMs = 4000;

const startTadawyApis = async (options) => {
  try {
    const {
      updateTimeoutRefAndRestart,
      companySiteRequestOptions,
      isProduction,
      exsysBaseUrl,
    } = options;

    const { response, isInternetDisconnected } = await createExsysQueryRequest({
      exsysBaseUrl,
      apiId: "QUERY_EXSYS_WHATSAPP_MESSAGE_DATA",
      params: {
        companyName: TADAWY,
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
      files,
      message,
    } = response || {};

    if (!isObjectHasData(response) || !isObjectHasData(message)) {
      setTimeout(async () => await startTadawyApis(options), restartMs);

      return;
    }

    let filesUploadedResults = [];

    if (isArrayHasData(files)) {
      const headersValues = {
        authorizationKey: authorization_Key,
        authorizationValue: authorization_Value,
      };

      const configPromises = files.map(
        async ({ url, filename }) =>
          await makeUploadFileRequest(url, filename, headersValues)
      );

      filesUploadedResults = (await Promise.all(configPromises)).filter(
        Boolean
      );
    }

    const {
      template: { components, ...restTemplate },
      ...restMessage
    } = message;

    const curredMessage = {
      ...restMessage,
      template: {
        components: [
          ...(isArrayHasData(filesUploadedResults)
            ? [
                {
                  type: "header",
                  parameters: filesUploadedResults.map((document) => ({
                    type: "document",
                    document,
                  })),
                },
              ]
            : []),
          ...components,
        ],
        ...restTemplate,
      },
    };

    const { localResultsData, shouldRestartServer } =
      await createTadawyRequestAndUpdateExsysServer({
        message_id,
        bodyData: curredMessage,
        companySiteRequestOptions: {
          ...companySiteRequestOptions,
          headers: {
            ...companySiteRequestOptions.headers,
            [authorization_Key]: authorization_Value,
          },
        },
        isProduction,
        exsysBaseUrl,
      });

    await updateResultsFolder({
      resultsFolderPath,
      fileName: message_id,
      data: localResultsData,
    });

    if (shouldRestartServer) {
      updateTimeoutRefAndRestart();
      return;
    }

    await startTadawyApis(options);
  } catch (error) {
    console.error("error", error);
    setTimeout(async () => await startTadawyApis(options), restartMs);
  }
};

export default startTadawyApis;
