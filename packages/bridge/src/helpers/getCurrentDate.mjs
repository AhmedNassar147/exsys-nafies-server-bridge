/*
 *
 * Helper: `getCurrentDate`.
 *
 */

const formalizeValue = (value) => {
  const strValue = value.toString();
  return value < 10 ? `0${strValue}` : strValue;
};

const getCurrentDate = () => {
  const ts = Date.now();

  const date_ob = new Date(ts);
  const date = date_ob.getDate();
  const year = date_ob.getFullYear();
  const month = formalizeValue(date_ob.getMonth() + 1);
  const hours = formalizeValue(date_ob.getHours());
  const minutes = formalizeValue(date_ob.getMinutes());
  const seconds = formalizeValue(date_ob.getSeconds());
  const amOrPm = date_ob.getHours() < 12 ? "AM" : "PM";

  const time = `${hours}:${minutes}:${seconds} ${amOrPm}`.toLowerCase();
  const dateString = `${month}/${date}/${year}`;

  return {
    time,
    dateString,
  };
};

getCurrentDate();

export default getCurrentDate;
