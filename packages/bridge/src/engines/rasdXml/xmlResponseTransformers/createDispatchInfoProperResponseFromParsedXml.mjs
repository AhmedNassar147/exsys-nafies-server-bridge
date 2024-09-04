/*
 *
 * Helper: `createDispatchInfoProperResponseFromParsedXml`.
 *
 */

const getTextValueOfObject = (object) => {
  const { _text } = object || {};
  return _text;
};

const createDispatchInfoProperResponseFromParsedXml =
  (exsysDataWhenRasdRespondsWithError) => (foundParsedXmlBody, htmlBody) => {
    if (htmlBody) {
      const { h1 } = htmlBody || {};

      return {
        error: getTextValueOfObject(h1),
        ...exsysDataWhenRasdRespondsWithError,
      };
    }

    const { ["S:Fault"]: faultError } = foundParsedXmlBody || {};

    if (faultError) {
      const { faultcode, faultstring } = faultError;

      return {
        errorCode: getTextValueOfObject(faultstring),
        error: getTextValueOfObject(faultcode),
        ...exsysDataWhenRasdRespondsWithError,
      };
    }

    const keys = Object.keys(foundParsedXmlBody);

    if (!keys || !keys.length) {
      return { data: undefined };
    }

    return {
      data: keys.reduce((acc, key) => {
        const {
          DISPATCHNOTIFICATIONID,
          NOTIFICATIONID,
          NOTIFICATIONDATE,
          FROMGLN,
          PRODUCTLIST,
        } = foundParsedXmlBody[key];
        const { PRODUCT } = PRODUCTLIST || {};

        const notificationId = getTextValueOfObject(
          DISPATCHNOTIFICATIONID || NOTIFICATIONID
        );
        const notificationDate = getTextValueOfObject(NOTIFICATIONDATE);
        const fromGln = getTextValueOfObject(FROMGLN);

        const products = Array.isArray(PRODUCT)
          ? PRODUCT.filter(
              ({ GTIN, QUANTITY, BN, XD, SN }) =>
                !!GTIN || !!QUANTITY || !!BN || !!XD || !!SN
            ).map(({ GTIN, QUANTITY, BN, XD, SN, RC }) => ({
              gtin: getTextValueOfObject(GTIN),
              quantity: getTextValueOfObject(QUANTITY),
              sn: getTextValueOfObject(SN),
              bn: getTextValueOfObject(BN),
              xd: getTextValueOfObject(XD),
              rc: getTextValueOfObject(RC),
              notificationId,
              notificationDate,
              fromGln,
            }))
          : [];

        acc.push(...products);

        return acc;
      }, []),
    };
  };

// {
//   "_declaration": { "_attributes": { "version": "1.0", "encoding": "UTF-8" } },
//   "S:Envelope": {
//     "_attributes": { "xmlns:S": "http://schemas.xmlsoap.org/soap/envelope/" },
// "S:Body": {
//   "ns2:AcceptDispatchNotificationServiceResponse": {
//     "_attributes": {
//       "xmlns:ns2": "http://dtts.sfda.gov.sa/DispatchDetailService"
//     },
//     "DISPATCHNOTIFICATIONID": { "_text": "732162605" },
//     "NOTIFICATIONDATE": { "_text": "2023-04-04" },
//     "FROMGLN": { "_text": "6285125000034" },
//     "PRODUCTLIST": {
//       "PRODUCT": [
//         {
//           "GTIN": { "_text": "05712249108427" },
//           "SN": { "_text": "1065129204838" },
//           "BN": { "_text": "NP5F088" },
//           "XD": { "_text": "2025-08-31" },
//           "RC": { "_text": "00000" }
//         },
//         {
//           "GTIN": { "_text": "05712249108427" },
//           "SN": { "_text": "1609764718224" },
//           "BN": { "_text": "NP5F088" },
//           "XD": { "_text": "2025-08-31" },
//           "RC": { "_text": "00000" }
//         },
//         {
//           "GTIN": { "_text": "05712249113834" },
//           "SN": { "_text": "1327592133362" },
//           "BN": { "_text": "N086926" },
//           "XD": { "_text": "2024-09-30" },
//           "RC": { "_text": "00000" }
//         }
//       ]
//     }
//   }
// }
//   }
// }

// FAULT ERROR when status 500
// {
//   "_declaration": { "_attributes": { "version": "1.0", "encoding": "UTF-8" } },
//   "S:Envelope": {
//     "_attributes": { "xmlns:S": "http://schemas.xmlsoap.org/soap/envelope/" },
//     "S:Body": {
//       "S:Fault": {
//         "_attributes": {
//           "xmlns:ns4": "http://www.w3.org/2003/05/soap-envelope"
//         },
//         "faultcode": { "_text": "S:Server" },
//         "faultstring": { "_text": "80202" },
//         "detail": {
//           "ns2:ServiceError": {
//             "_attributes": {
//               "xmlns:ns2": "http://dtts.sfda.gov.sa/ReturnService"
//             },
//             "FC": { "_text": "80202" }
//           }
//         }
//       }
//     }
//   }
// }

// error when status 401
// {
//   "_doctype": "html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\"",
//   "html": {
//     "body": {
//       "h1": { "_text": "HTTP Status 401 - Unauthorized" },
//       "hr": [{}, {}],
//       "p": [
//         { "b": { "_text": "type" }, "_text": " Status report" },
//         { "b": { "_text": "message" }, "_text": "Unauthorized" },
//         {
//           "b": { "_text": "description" },
//           "_text": "This request requires HTTP authentication."
//         }
//       ],
//       "h3": { "_text": "Payara Server  5.183 #badassfish" }
//     }
//   }
// }

export default createDispatchInfoProperResponseFromParsedXml;
