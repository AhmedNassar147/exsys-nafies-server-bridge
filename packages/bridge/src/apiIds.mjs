/*
 *
 * apiIds: `server`.
 *
 */
const API_IDS = {
  QUERY_EXSYS_NAFIES_REQUEST_BODY_DATA:
    "exsys_nphies_pkg/get_nphies_not_send_request",
  UPDATE_EXSYS_WITH_NAFIES_RESULTS:
    "exsys_nphies_pkg/update_nphies_send_request",
  //  http://207.180.237.36:9090/ords/exsys_api/exsys_rasd_pkg/get_rasd_products_data
  QUERY_EXSYS_RASD_REQUEST_DATA: "exsys_rasd_pkg/get_rasd_products_data",
  // http://207.180.237.36:9090/ords/exsys_api/exsys_rasd_pkg/rasd_products_dml
  POST_RASD_REQUEST_DATA_TO_EXSYS: "exsys_rasd_pkg/rasd_products_dml",
  // http://149.102.140.8:9090/ords/exsys_api/exsys_whatsapp_pkg/whatsapp_not_send_data
  QUERY_EXSYS_TADAWY_MESSAGE_DATA: "exsys_whatsapp_pkg/whatsapp_not_send_data",
  // http://149.102.140.8:9090/ords/exsys_api/exsys_whatsapp_pkg/whatsapp_response_dml
  POST_TADAWY_RESPONSE_TO_EXSYS: "exsys_whatsapp_pkg/whatsapp_response_dml",
};

export default API_IDS;
