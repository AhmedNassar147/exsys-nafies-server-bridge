/*
 *
 * Helper: `readJsonFile`.
 *
 */
import { readFile } from "fs/promises";

const readJsonFile = async (jsonFilePath, toJSData) => {
  const jsonFile = await readFile(jsonFilePath, {
    encoding: "utf8",
  });

  return toJSData && jsonFile ? JSON.parse(jsonFile) : jsonFile;
};

export default readJsonFile;
