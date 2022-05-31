/*
 *
 * Helper: `updateResultsFolder`.
 *
 */

import { writeFile, readFile, mkdir } from "fs/promises";
import { checkPathExists } from "@exsys-server/helpers";
import getCurrentDate from "./getCurrentDate.mjs";

const updateResultsFolder = async ({ data, resultsFolderPath }) => {
  const { dateString, time } = getCurrentDate();

  if (!(await checkPathExists(resultsFolderPath))) {
    await mkdir(resultsFolderPath, { recursive: true });
  }

  const currentResultFilePath = `${resultsFolderPath}/${dateString}.json`;
  let previousResultFileData = [];

  if (await checkPathExists(currentResultFilePath)) {
    const currentFileResultsJson = await readFile(
      currentResultFilePath,
      "utf-8"
    );
    previousResultFileData = currentFileResultsJson
      ? JSON.parse(currentFileResultsJson)
      : previousResultFileData;
  }

  const nextFileResults = [
    {
      time,
      ...data,
    },
    ...previousResultFileData,
  ];

  await writeFile(
    currentResultFilePath,
    JSON.stringify(nextFileResults, null, 2)
  );
};

export default updateResultsFolder;
