/*
 *
 * Helper: `createZohoRequestAndUpdateExsysServer`.
 *
 */
import { isArrayHasData } from "@exsys-server/helpers";
import covertDateToStandardDate from "./covertDateToStandardDate.mjs";
import createAxiosPostRequest from "../../helpers/createAxiosPostRequest.mjs";
import postCompanyDataResponseToExsysDB from "../../helpers/postCompanyDataResponseToExsysDB.mjs";

const zohoApprovedStausField = "$approval_state";

const createZohoRequestAndUpdateExsysServer = async ({
  apiUrl,
  bodyData,
  companySiteRequestOptions,
  exsysBaseUrl,
}) => {
  const [{ Appointment_ID }] = bodyData;

  const curredData = {
    data: bodyData.map(({ Reservation_Date, ...rest }) => ({
      ...rest,
      Reservation_Date: covertDateToStandardDate(Reservation_Date),
    })),
  };

  const { response } = await createAxiosPostRequest({
    apiUrl,
    bodyData: curredData,
    requestOptions: companySiteRequestOptions,
  });

  const { data, status, message } = response;

  const isSuccess = status !== "error" && isArrayHasData(data);

  const apiPostDataToExsys = isSuccess
    ? data.reduce(
        (
          acc,
          {
            status,
            message,
            details: { [zohoApprovedStausField]: approval_state },
          }
        ) => {
          acc.status = status;
          acc.message = message;
          acc.approval_state = approval_state;
          acc.appointment_id = Appointment_ID;

          return acc;
        },
        {}
      )
    : {
        status: "error",
        message,
        appointment_id: Appointment_ID,
      };

  // const abc = false;

  const {
    isInternetDisconnectedWhenPostingDataToExsys,
    isSuccessPostingDataToExsys,
    isDataSentToExsys,
  } = await postCompanyDataResponseToExsysDB({
    apiId: "POST_EXSYS_ZOHO_DATA",
    apiPostData: apiPostDataToExsys,
    exsysBaseUrl,
  });
  // : {
  //     isInternetDisconnectedWhenPostingDataToExsys: false,
  //     isSuccessPostingDataToExsys: false,
  //     isDataSentToExsys: false,
  //   };

  return {
    shouldRestartServer: isInternetDisconnectedWhenPostingDataToExsys,
    localResultsData: {
      apiUrl,
      exsysData: bodyData,
      exsysDataSentToZohoServer: curredData,
      zohoOriginalResponse: response,
      isZohoDataSentToExsys: isDataSentToExsys,
      extractedZohoDataPostedTExsys: apiPostDataToExsys,
      successededToPostZohoDataToExsysServer:
        isInternetDisconnectedWhenPostingDataToExsys
          ? false
          : isSuccessPostingDataToExsys,
    },
  };
};

export default createZohoRequestAndUpdateExsysServer;
