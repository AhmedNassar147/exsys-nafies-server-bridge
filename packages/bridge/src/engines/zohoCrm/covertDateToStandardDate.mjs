/*
 *
 * Helper: `covertDateToStandardDate`.
 *
 */
const covertDateToStandardDate = (dateTime24) => {
  if (!dateTime24) {
    return undefined;
  }

  const dateObj = new Date(dateTime24);
  const iso8601Date = dateObj.toISOString();

  return iso8601Date.replace(/\..+Z$/, "+03:00");
};

export default covertDateToStandardDate;
