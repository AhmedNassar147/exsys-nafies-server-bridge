/*
 *
 * `checkIfPackageAlreadyLinkedElseLink`: `cli`.
 *
 */
import { execSync } from "child_process";
import { createCmdMessage, checkPathExists } from "@exsys-server/helpers";
import { PACKAGE_NAME } from "./constants.mjs";

const checkIfPackageAlreadyLinkedElseLink = async ({
  globalNpmBinsFolderPath,
  globalNpmModulesFolder,
}) => {
  const doesGlobalBinHasCurrentBins = !!(await checkPathExists(
    globalNpmBinsFolderPath.replace(/\n/, "")
  ));

  const doesGlobalNpmModulesHaveCurrentPackage = !!(await checkPathExists(
    globalNpmModulesFolder.replace(/\n/, "")
  ));

  if (doesGlobalNpmModulesHaveCurrentPackage && doesGlobalBinHasCurrentBins) {
    createCmdMessage({
      type: "success",
      message: "already linked 😉",
    });

    return;
  }

  try {
    execSync(`npm link`);
    createCmdMessage({
      type: "success",
      message: `finished linking "${PACKAGE_NAME}" ✨`,
    });
  } catch (error) {
    createCmdMessage({
      type: "error",
      message:
        `something went wrong when linking "${PACKAGE_NAME}" \n` +
        `nodeJS error: ${error}`,
    });
  }
};

export default checkIfPackageAlreadyLinkedElseLink;
