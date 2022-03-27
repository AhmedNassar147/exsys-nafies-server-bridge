/*
 *
 * Helper: `getCurrentDate`.
 *
 */
const getCurrentDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const timeAmPm = hours > 12 ? "pm" : "am";

  return {
    datString: `${day}-${month}-${year}`,
    time: `${hours}:${minutes}:${seconds} ${timeAmPm}`,
  };
};

export default getCurrentDate;
