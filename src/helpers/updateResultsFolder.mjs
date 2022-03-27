/*
 *
 * Helper: `updateResultsFolder`.
 *
 */

import { writeFile, readFile, mkdir } from "fs/promises";
import { RESULTS_FOLDER_PATH } from "../constants.mjs";
import getCurrentDate from "./getCurrentDate.mjs";
import checkPathExists from "./checkPathExists.mjs";

const updateResultsFolder = async ({
  exsysApiCodeId,
  nafiesPostData,
  nafiesServerResult,
  successededToPostNafiesDataToExsysServer,
}) => {
  const { datString, time } = getCurrentDate();

  if (!(await checkPathExists(RESULTS_FOLDER_PATH))) {
    await mkdir(RESULTS_FOLDER_PATH, { recursive: true });
  }

  console.log("RESULTS_FOLDER_PATH", RESULTS_FOLDER_PATH);

  const currentResultFilePath = `${RESULTS_FOLDER_PATH}/${datString}.json`;
  let previousResultFileData = {};

  if (await checkPathExists(currentResultFilePath)) {
    const currentFileResultsJson = readFile(currentResultFilePath, "utf-8");
    previousResultFileData = currentFileResultsJson
      ? JSON.parse(currentFileResultsJson)
      : previousResultFileData;
  }

  const nextFileResults = {
    [`${exsysApiCodeId}-${time}`]: {
      time,
      api_pk: exsysApiCodeId,
      exsysDataSentToNafiesServer: nafiesPostData,
      nafiesResponseBasedExsysData: nafiesServerResult,
      successededToPostNafiesDataToExsysServer,
    },
    ...previousResultFileData,
  };

  await writeFile(
    currentResultFilePath,
    JSON.stringify(nextFileResults, null, 2)
  );
};

export default updateResultsFolder;
