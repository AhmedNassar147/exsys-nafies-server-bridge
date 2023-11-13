/*
 *
 * Helper: `updateResultsFolder`.
 *
 */

import { writeFile } from "fs/promises";
import {
  checkPathExists,
  readJsonFile,
  createRootFolderInResults,
} from "@exsys-server/helpers";
import getCurrentDate from "./getCurrentDate.mjs";

const updateResultsFolder = async ({ data, resultsFolderPath }) => {
  const { dateString, time } = getCurrentDate();
  const finalResultsFolderPath = await createRootFolderInResults(
    resultsFolderPath
  );

  const currentResultFilePath = `${finalResultsFolderPath}/${dateString}.json`;
  let previousResultFileData = [];

  if (await checkPathExists(currentResultFilePath)) {
    previousResultFileData = await readJsonFile(currentResultFilePath, true);
  }

  const nextFileResults = [
    ...(Array.isArray(data)
      ? data.map((item) => ({
          ...item,
          time,
        }))
      : [
          {
            time,
            ...data,
          },
        ]),
    ...(previousResultFileData || []),
  ];

  await writeFile(
    currentResultFilePath,
    JSON.stringify(nextFileResults, null, 2)
  );
};

export default updateResultsFolder;
