/*
 *
 * Helper: `createRasdRequestAndUpdateExsysServer`.
 *
 */
import { xml2json } from "xml-js";
import { camelCaseFirstLetter, isObjectHasData } from "@exsys-server/helpers";
import createAxiosPostRequest from "../../helpers/createAxiosPostRequest.mjs";
import { COMPANY_API_URLS } from "../../constants.mjs";
import postCompanyDataResponseToExsysDB from "../../helpers/postCompanyDataResponseToExsysDB.mjs";

const { RASD_PRODUCTION_XML } = COMPANY_API_URLS;

const ENVELOPE = "S:Envelope";

const createRasdRequestAndUpdateExsysServer = async ({
  rasdApiName,
  bodyData,
  exsysData,
  companySiteRequestOptions,
  exsysBaseUrl,
  jsonFromXmlBodyTransformer,
}) => {
  const _rasdApiName = camelCaseFirstLetter(rasdApiName);
  const apiUrl = `${RASD_PRODUCTION_XML}/${_rasdApiName}/${_rasdApiName}`;

  const { response } = await createAxiosPostRequest({
    apiUrl,
    bodyData,
    requestOptions: companySiteRequestOptions,
  });

  // const isSuccess = [200, 201].includes(responseStatus);

  const jsonFromXml = xml2json(response, { compact: true });

  const parsedJson = !jsonFromXml ? {} : JSON.parse(jsonFromXml);
  const { [ENVELOPE]: envelope, html } = parsedJson;

  const { ["S:Body"]: body } = envelope || {
    [ENVELOPE]: {},
  };

  const { body: htmlBody } = html || {};

  const transformedRasdResponse = jsonFromXmlBodyTransformer(body, htmlBody);

  const shouldPostDataToExsys = isObjectHasData(transformedRasdResponse);

  const apiPostDataToExsys = {
    responseFromRasdApiName: rasdApiName,
    ...transformedRasdResponse,
  };

  const {
    isInternetDisconnectedWhenPostingDataToExsys,
    isSuccessPostingDataToExsys,
    isDataSentToExsys,
  } = shouldPostDataToExsys
    ? await postCompanyDataResponseToExsysDB({
        apiId: "POST_RASD_XML_REQUEST_DATA_TO_EXSYS",
        apiPostData: apiPostDataToExsys,
        exsysBaseUrl,
      })
    : {
        isInternetDisconnectedWhenPostingDataToExsys: false,
        isSuccessPostingDataToExsys: false,
        isDataSentToExsys: false,
      };

  return {
    shouldRestartServer: isInternetDisconnectedWhenPostingDataToExsys,
    localResultsData: {
      rasdApiName,
      exsysData,
      exsysDataSentToRasdServer: bodyData,
      rasdResponseBasedExsysData: apiPostDataToExsys,
      isRasdDataSentToExsys: isDataSentToExsys,
      successededToPostRasdDataToExsysServer:
        isInternetDisconnectedWhenPostingDataToExsys
          ? false
          : isSuccessPostingDataToExsys,
    },
  };
};

export default createRasdRequestAndUpdateExsysServer;
