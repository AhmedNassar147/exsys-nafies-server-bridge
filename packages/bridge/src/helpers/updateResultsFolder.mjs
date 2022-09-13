/*
 *
 * Helper: `updateResultsFolder`.
 *
 */

import { join } from "path";
import { writeFile, readFile, mkdir } from "fs/promises";
import {
  checkPathExists,
  findRootYarnWorkSpaces,
  readJsonFile,
} from "@exsys-server/helpers";
import getCurrentDate from "./getCurrentDate.mjs";

const updateResultsFolder = async ({ data, resultsFolderPath }) => {
  const { dateString, time } = getCurrentDate();
  const rootYarnWorkSpacePath = await findRootYarnWorkSpaces();
  const finalResultsFolderPath = join(rootYarnWorkSpacePath, resultsFolderPath);

  if (!(await checkPathExists(finalResultsFolderPath))) {
    await mkdir(finalResultsFolderPath, { recursive: true });
  }

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
