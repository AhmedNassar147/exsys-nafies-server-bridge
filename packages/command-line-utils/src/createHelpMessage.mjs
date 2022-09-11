/*
 *
 * `createHelpMessage`: `@exsys-server/command-line-utils`.
 *
 */
import chalk from "chalk";

const createHelpMessage = ({ scriptName, description, helpersKeys }) => {
  if (!scriptName) {
    throw new Error(
      `Please Provide the script Name, given scriptName=${scriptName}`
    );
  }

  if (!description) {
    throw new Error(
      `Please Provide the description, given description=${description}`
    );
  }

  if (!(helpersKeys && helpersKeys.length)) {
    throw new Error(
      `Please Provide the helpersKeys, given helpersKeys=${helpersKeys}`
    );
  }

  console.log(chalk.magenta(`use this ${scriptName} to ${description}.`));

  console.table(
    helpersKeys.map(({ description, keyOrKeys }) => {
      const isString = typeof keyOrKeys === "string";

      keyOrKeys = isString
        ? `--${keyOrKeys}`
        : keyOrKeys
            .map((key) => `--${key} `)
            .toString()
            .replace(",", " | ");

      return {
        key: keyOrKeys,
        description,
      };
    })
  );
};

export default createHelpMessage;
