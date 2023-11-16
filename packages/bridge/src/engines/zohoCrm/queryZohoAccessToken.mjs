/*
 *
 * Helper: `queryZohoAccessToken`.
 *
 */

import createAxiosPostRequest from "../../helpers/createAxiosPostRequest.mjs";

const apiUrl =
  "https://accounts.zoho.com/oauth/v2/token?client_id=1000.10SRQLOLF3F0CC84QDW6ZVGF87AKDL&refresh_token=1000.f9fa1e2357ebc11ee0c9922052b8b998.e9e34736e51e9f760987b72575dcfec0&client_secret=428719e9f54c48b801314e30ada236e3b7c4a23a9c&grant_type=refresh_token";

const queryZohoAccessToken = async () => {
  const { response } = await createAxiosPostRequest({
    apiUrl,
  });

  const { api_domain, access_token } = response;

  return {
    hasAccessToken: !!access_token,
    zohoApiUrl: `${api_domain}/crm/v5/Reservations/upsert`,
    headers: {
      Authorization: "Bearer " + access_token,
    },
  };
};

export default queryZohoAccessToken;

await queryZohoAccessToken();
