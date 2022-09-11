/*
 *
 * toCamelCase: `@exsys-server/command-line-utils`.
 *
 */
const toCamelCase = (str) =>
  str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
export default toCamelCase;
