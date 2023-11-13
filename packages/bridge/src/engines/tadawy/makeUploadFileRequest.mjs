/*
 *
 * Helper: `makeUploadFileRequest`.
 *
 */
import { createReadStream } from "fs";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import FormData from "form-data";
import { createRootFolderInResults } from "@exsys-server/helpers";
import { COMPANY_API_URLS } from "../../constants.mjs";
import createAxiosPostRequest from "../../helpers/createAxiosPostRequest.mjs";
import getRemoteFilePathData from "../../helpers/getRemoteFilePathData.mjs";

const createDownloadedFileInResultFolder = async (fileName, fileData) => {
  const finalResultsFolderPath = await createRootFolderInResults(
    "downloadedFiles"
  );

  const writtenFilePath = join(finalResultsFolderPath, fileName);

  await writeFile(writtenFilePath, fileData);

  return writtenFilePath;
};

const { TADAWY_MEDIA } = COMPANY_API_URLS;

const makeUploadFileRequest = async (
  fileUrl,
  filename,
  { authorizationKey, authorizationValue }
) => {
  const { data: fileBinary } = await getRemoteFilePathData(fileUrl);

  if (fileBinary) {
    const writtenFilePath = await createDownloadedFileInResultFolder(
      filename,
      fileBinary
    );

    const formData = new FormData();
    formData.append("messaging_product", "WHATSAPP");
    formData.append("file", createReadStream(writtenFilePath));

    const { response } = await createAxiosPostRequest({
      apiUrl: TADAWY_MEDIA,
      bodyData: formData,
      requestOptions: {
        headers: {
          ...formData.getHeaders(),
          [authorizationKey]: authorizationValue,
        },
      },
    });

    await unlink(writtenFilePath);
    const { id } = response || {};

    return { id, filename };
  }

  return false;
};

export default makeUploadFileRequest;

// const s = await makeUploadFileRequest(
//   "http://149.102.140.8:7778/reports/rwservlet?server=rep_server_FRHome1+report=D:\\ExsysReports\\LBRESULTALL.rep+userid=EXSYS_API/EXSYS_API@tadawi2020.dyndns.biz:1521/EXSYS+desformat=pdf+DESTYPE=cache+P_ORGANIZATION_NO=03+P_PATIENT_RESULT_NO=23/038817",
//   "ahmed.pdf",
//   {
//     authorizationKey: "D360-API-KEY",
//     authorizationValue: "tvDPD4ITNenVzIRzBWongnK7AK",
//   }
// );

// console.log("s", s);
