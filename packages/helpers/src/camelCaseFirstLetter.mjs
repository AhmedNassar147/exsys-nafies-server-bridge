/*
 *
 * Helper: `camelCaseFirstLetter`.
 *
 */
const camelCaseFirstLetter = (text) =>
  text.replace(/(^\w)/g, (m) => m.toUpperCase());

export default camelCaseFirstLetter;
