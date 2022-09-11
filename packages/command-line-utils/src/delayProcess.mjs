/*
 *
 * `delayProcess`: `@exsys-server/command-line-utils`.
 *
 */
const delayProcess = (fn, options, ms) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(fn(options));
    }, +ms)
  );

export default delayProcess;
