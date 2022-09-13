/*
 *
 * Helper: `createCmdMessage`.
 *
 */
import chalk from "chalk";

const CHALK_COLOR = {
  error: "red",
  success: "green",
  info: "cyan",
};

const createCmdMessage = ({ type, message }) =>
  console.log(
    `${chalk.bold.magenta("[exsys-nphies-bridge]:")} ${chalk[CHALK_COLOR[type]](
      message
    )}`
  );

export default createCmdMessage;
