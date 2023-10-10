/*
 *
 * Engine: `startZohoCrmApis`.
 *
 */
import { isArrayHasData } from "@exsys-server/helpers";
import { CERTIFICATE_NAMES, RESULTS_FOLDER_PATHS } from "../../constants.mjs";
import createExsysQueryRequest from "../../helpers/createExsysQueryRequest.mjs";
import queryZohoAccessToken from "./queryZohoAccessToken.mjs";
import createZohoRequestAndUpdateExsysServer from "./createZohoRequestAndUpdateExsysServer.mjs";
import updateResultsFolder from "../../helpers/updateResultsFolder.mjs";

const resultsFolderPath = RESULTS_FOLDER_PATHS[CERTIFICATE_NAMES.ZOHO_CRM];

const maxRestartMs = 8000;

const startZohoCrmApis = async (options) => {
  try {
    const {
      updateTimeoutRefAndRestart,
      companySiteRequestOptions,
      exsysBaseUrl,
    } = options;
    const { response, isInternetDisconnected } = await createExsysQueryRequest({
      exsysBaseUrl,
      apiId: "QUERY_EXSYS_ZOHO_DATA",
    });

    if (isInternetDisconnected) {
      updateTimeoutRefAndRestart();
      return;
    }

    const { data } = response || {};

    if (!isArrayHasData(data)) {
      setTimeout(async () => await startZohoCrmApis(options), maxRestartMs);
      return;
    }

    const { hasAccessToken, zohoApiUrl, headers } =
      await queryZohoAccessToken();

    if (!hasAccessToken) {
      console.error("zoho didn't provide access token, restarting server ...");
      setTimeout(async () => await startZohoCrmApis(options), maxRestartMs);
      return;
    }

    const { localResultsData, shouldRestartServer } =
      await createZohoRequestAndUpdateExsysServer({
        apiUrl: zohoApiUrl,
        bodyData: data,
        exsysBaseUrl,
        companySiteRequestOptions: {
          ...companySiteRequestOptions,
          headers: {
            ...companySiteRequestOptions.headers,
            Accept: "application/json",
            ...headers,
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

    setTimeout(async () => await startZohoCrmApis(options), maxRestartMs);
  } catch (error) {
    console.error("error", error);
    setTimeout(async () => await startZohoCrmApis(options), maxRestartMs);
  }
};

export default startZohoCrmApis;
