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
  getCurrentDate,
} from "@exsys-server/helpers";

const updateResultsFolder = async ({ data, resultsFolderPath, fileName }) => {
  const { dateString, time } = getCurrentDate();
  const finalResultsFolderPath = await createRootFolderInResults(
    fileName ? `${resultsFolderPath}/${dateString}` : resultsFolderPath
  );

  const fileSegments = [
    finalResultsFolderPath,
    fileName ? "" : dateString,
    fileName,
  ].filter(Boolean);

  const currentResultFilePath = `${fileSegments.join("/")}.json`;

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
