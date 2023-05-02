/*
 *
 * Helper: `createAxiosPostRequest`.
 *
 */
import axios from "axios";

const createAxiosPostRequest = async ({ apiUrl, bodyData, requestOptions }) => {
  let response;
  let responseStatus;

  try {
    const { data, status } = await axios.post(apiUrl, bodyData, requestOptions);
    response = data;
    responseStatus = status;
  } catch (apiFetchError) {
    const { response: serverResponse } = apiFetchError || {};
    const { data: responseData, status } = serverResponse || {};
    responseStatus = status;
    response = responseData;
  }

  return {
    response,
    responseStatus,
  };
};

export default createAxiosPostRequest;
