/*
 *
 * Helper: `restartProcessAndPrintMessage`.
 *
 */
import chalk from "chalk";
import createCmdMessage from "./createCmdMessage.mjs";
import restartProcess from "./restartProcess.mjs";
import { RESTART_MS } from "../constants.mjs";

const restartProcessAndPrintMessage = (
  restartTimeOutRef,
  hideNetworkMessage
) => {
  if (!hideNetworkMessage) {
    createCmdMessage({
      type: "error",
      message: `the "network" is disconnected, ${chalk.white(
        `restarting in ${RESTART_MS / 60000} minutes.`
      )}`,
    });
  }

  if (restartTimeOutRef && restartTimeOutRef.unref) {
    restartTimeOutRef.unref();
  }

  return restartProcess();
};

export default restartProcessAndPrintMessage;
