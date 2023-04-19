/*
 *
 * Helper: `createSmsRequestAndUpdateExsysServer`.
 *
 */
import createAxiosPostRequest from "../../helpers/createAxiosPostRequest.mjs";
import createQueryRequest from "../../helpers/createQueryRequest.mjs";
import postCompanyDataResponseToExsysDB from "../../helpers/postCompanyDataResponseToExsysDB.mjs";

const createSmsRequestAndUpdateExsysServer = async ({
  bodyData,
  companySiteRequestOptions,
  exsysBaseUrl,
  createDataWillBePostedToExsys,
  companyApiUrl,
  isCompanyQueryPostByQueryFetch,
}) => {
  const { response, responseStatus } = await (isCompanyQueryPostByQueryFetch
    ? createQueryRequest({
        baseApiUrl: companyApiUrl,
        params: bodyData,
      })
    : createAxiosPostRequest({
        apiUrl: companyApiUrl,
        bodyData,
        requestOptions: companySiteRequestOptions,
      }));

  const apiPostDataToExsys = createDataWillBePostedToExsys({
    response,
    responseStatus,
  });

  const {
    isInternetDisconnectedWhenPostingDataToExsys,
    isSuccessPostingDataToExsys,
    isDataSentToExsys,
  } = await postCompanyDataResponseToExsysDB({
    apiId: "QUERY_EXSYS_WHATSAPP_SMS_RESPONSE_TO_EXSYS",
    apiPostData: apiPostDataToExsys,
    exsysBaseUrl,
  });

  return {
    shouldRestartServer: isInternetDisconnectedWhenPostingDataToExsys,
    localResultsData: {
      exsysDataSentToCompanyServer: bodyData,
      companyResponseBasedExsysData: response,
      dataSentToExsysBasedCompanyResponse: apiPostDataToExsys,
      isCompanyDataSentToExsys: isDataSentToExsys,
      successededToPostCompanyDataToExsysServer:
        isInternetDisconnectedWhenPostingDataToExsys
          ? false
          : isSuccessPostingDataToExsys,
    },
  };
};

export default createSmsRequestAndUpdateExsysServer;
