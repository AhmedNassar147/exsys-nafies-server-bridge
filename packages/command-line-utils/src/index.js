/*
 *
 * Package: `@exsys-server/command-line-utils`.
 *
 */
import createCliController from "./createCliController.mjs";

const sharedHelperKey = {
  keyOrKeys: ["help", "h"],
  description: `to See All options for this cli. (--h || --help)`,
};

export { createCliController, sharedHelperKey };
