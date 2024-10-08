/*
 *
 * Helper: `createRasdApisXml`.
 *
 */
import { camelCaseFirstLetter } from "@exsys-server/helpers";
import { RASD_API_TYPE_NAMES_XML } from "./constants.mjs";

const {
  pharmacySaleService,
  pharmacySaleCancelService,
  dispatchBatchService,
  acceptDispatchService,
  dispatchService,
  acceptBatchService,
  acceptService,
  returnService,
  dispatchDetailService,
  returnBatchService,
} = RASD_API_TYPE_NAMES_XML;

const getApiAndTagName = (rasdApiName) => {
  const apiName = camelCaseFirstLetter(rasdApiName);
  const tagName = `${apiName}Request`;

  return {
    apiName,
    tagName,
  };
};

const createOrAcceptDispatchServiceXml = ({ data, rasdApiName }) => {
  const { apiName, tagName } = getApiAndTagName(rasdApiName);

  return `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
<s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
<${tagName} xmlns="http://dtts.sfda.gov.sa/${apiName}">
${data
  .map(
    ({ notificationId }) =>
      `<DISPATCHNOTIFICATIONID xmlns="">${notificationId}</DISPATCHNOTIFICATIONID>`
  )
  .join("")}</${tagName}></s:Body></s:Envelope>`.replace(/\n|\s{2,}/g, "");
};

const createProductsXml = ({ data, toGln, prescriptionDate, rasdApiName }) => {
  const { apiName, tagName } = getApiAndTagName(rasdApiName);

  const dataLength = data.length;

  const finalData = [
    ...data,
    dataLength === 1
      ? {
          gtin: "",
          quantity: "",
          sn: "",
          bn: "",
          xd: "",
        }
      : null,
  ].filter(Boolean);

  return `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
      <${tagName} xmlns="http://dtts.sfda.gov.sa/${apiName}">
      ${toGln ? `<TOGLN xmlns="">${toGln}</TOGLN>` : ""}
      ${
        prescriptionDate
          ? `<PRESCRIPTIONDATE xmlns="">${prescriptionDate}</PRESCRIPTIONDATE>`
          : ""
      }
        <PRODUCTLIST xmlns="">
          ${finalData
            .map(
              ({ gtin, quantity, bn, sn, xd }) =>
                `<PRODUCT>
                  <GTIN>${gtin}</GTIN>
                  ${sn ? `<SN>${sn}</SN>` : `<QUANTITY>${quantity}</QUANTITY>`}
                  <BN>${bn}</BN>
                  <XD>${xd}</XD>
                </PRODUCT>
              `
            )
            .join("")}
        </PRODUCTLIST>
      </${tagName}>
    </s:Body>
    </s:Envelope>`.replace(/\n|\s{2,}/g, "");
};

const RASD_REQUESTS_XML_TEMP = {
  [dispatchDetailService]: createOrAcceptDispatchServiceXml,
  [acceptDispatchService]: createOrAcceptDispatchServiceXml,
  [dispatchBatchService]: createProductsXml,
  [pharmacySaleService]: createProductsXml,
  [pharmacySaleCancelService]: createProductsXml,
  [dispatchService]: createProductsXml,
  [acceptBatchService]: createProductsXml,
  [acceptService]: createProductsXml,
  [returnBatchService]: createProductsXml,
  [returnService]: createProductsXml,
};

export default RASD_REQUESTS_XML_TEMP;
