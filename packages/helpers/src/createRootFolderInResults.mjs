/*
 *
 * Helper: `createRootFolderInResults`.
 *
 */
import { mkdir } from "fs/promises";
import { join } from "path";
import checkPathExists from "./checkPathExists.mjs";
import findRootYarnWorkSpaces from "./findRootYarnWorkSpaces.mjs";

const createRootFolderInResults = async (folderName) => {
  const rootYarnWorkSpacePath = await findRootYarnWorkSpaces();
  const finalResultsFolderPath = join(
    rootYarnWorkSpacePath,
    "results",
    folderName
  );

  if (!(await checkPathExists(finalResultsFolderPath))) {
    await mkdir(finalResultsFolderPath, { recursive: true });
  }

  return finalResultsFolderPath;
};

export default createRootFolderInResults;
