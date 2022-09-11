/*
 *
 * `collectProcessOptions`: `@exsys-server/command-line-utils`.
 *
 */
import collectProcessOptionsSync from "./collectProcessOptionsSync.mjs";

const collectProcessOptions = async () =>
  new Promise((resolve) => resolve(collectProcessOptionsSync()));

export default collectProcessOptions;
