/*
 *
 * Helper: `checkPathExists`.
 *
 */
import { stat } from "fs/promises";

const checkPathExists = (filePath) =>
  stat(filePath)
    .then(() => filePath)
    .catch(() => false);

export default checkPathExists;
