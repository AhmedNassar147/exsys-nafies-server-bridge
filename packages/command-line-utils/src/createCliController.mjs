/*
 *
 * `createCliController`: `@exsys-server/command-line-utils`.
 *
 */
import createHelpMessage from "./createHelpMessage.mjs";
import collectProcessOptions from "./collectProcessOptions.mjs";

const createCliController = async ({
  scriptName,
  description,
  helpersKeys,
  throwIfNoOptionSet,
  runCliFn,
}) => {
  const { hasOptions, shouldDisplayHelpMessage, ...cliOptions } =
    await collectProcessOptions();

  if (throwIfNoOptionSet && !hasOptions) {
    throw new Error(`
      Please set At lest set one option for this script ${scriptName}.
      Please run \`yarn ${scriptName} --h \` to see all available options.
    `);
  }

  if (shouldDisplayHelpMessage) {
    createHelpMessage({
      scriptName,
      description,
      helpersKeys,
    });

    return;
  }

  if (runCliFn) {
    await runCliFn(cliOptions);
  }
};

export default createCliController;
