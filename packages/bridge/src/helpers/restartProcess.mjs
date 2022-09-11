/*
 *
 * Helper: `restartProcess`.
 *
 */
import { spawn } from "child_process";
import { isWindowsPlatform } from "@exsys-server/helpers";
import { RESTART_MS } from "../constants.mjs";

const restartProcess = (processArgs) => {
  const params = [...new Set([...process.argv, ...(processArgs || [])])];

  const timeOutId = setTimeout(() => {
    spawn(process.argv.shift(), params, {
      cwd: process.cwd(),
      detached: true,
      // stdio: "inherit",
      ...(isWindowsPlatform()
        ? {
            shell: "powershell.exe",
          }
        : null),
    });
  }, RESTART_MS);

  return timeOutId;
};

export default restartProcess;
