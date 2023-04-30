/*
 *
 * Constants: `rasdXml`.
 *
 */
export const RASD_API_TYPE_NAMES_XML = {
  dispatchDetailService: "dispatchDetailService",
  pharmacySaleService: "pharmacySaleService",
  pharmacySaleCancelService: "pharmacySaleCancelService",
  dispatchService: "dispatchService",
  acceptDispatchService: "acceptDispatchService",
  acceptService: "acceptService",
  returnService: "returnService",
};

export const RASD_REQUESTS_XML_TEMP = {
  [RASD_API_TYPE_NAMES_XML.dispatchDetailService]: ({
    data,
  }) => `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <DispatchDetailServiceRequest xmlns="http://dtts.sfda.gov.sa/DispatchDetailService">
      ${data.map((notificationId) => (
        <DISPATCHNOTIFICATIONID xmlns="">
          ${notificationId}
        </DISPATCHNOTIFICATIONID>
      ))}
    </DispatchDetailServiceRequest>
  </s:Body>
  </s:Envelope>`,
  [RASD_API_TYPE_NAMES_XML.pharmacySaleService]: ({
    data,
    toGln,
    prescriptionDate,
  }) => `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <PharmacySaleServiceRequest xmlns="http://dtts.sfda.gov.sa/PharmacySaleService">
    <TOGLN xmlns="">${toGln}</TOGLN>
    <PRESCRIPTIONDATE xmlns="">${prescriptionDate}</PRESCRIPTIONDATE>
      <PRODUCTLIST xmlns="">
        ${data.map(({ gti, serial, batch, expiryDate }) => (
          <PRODUCT>
            <GTIN>${gti}</GTIN>
            <SN>${serial}</SN>
            <BN>${batch}</BN>
            <XD>${expiryDate}</XD>
          </PRODUCT>
        ))}
      </PRODUCTLIST>
    </PharmacySaleServiceRequest>
  </s:Body>
  </s:Envelope>`,
  [RASD_API_TYPE_NAMES_XML.pharmacySaleCancelService]: () => ``,
  [RASD_API_TYPE_NAMES_XML.dispatchService]: () => ``,
  [RASD_API_TYPE_NAMES_XML.acceptDispatchService]: () => ``,
  [RASD_API_TYPE_NAMES_XML.acceptService]: () => ``,
  [RASD_API_TYPE_NAMES_XML.returnService]: () => ``,
};
