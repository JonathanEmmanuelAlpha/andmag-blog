const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 12 * MONTH;

export default function toTimeString(time) {
  const targetTime = new Date(time).getTime();
  const currentTime = Date.now();
  const target = currentTime - targetTime;

  let output = "";
  if (target <= SECOND) output = "il y'a 1s";

  if (target > SECOND && target < MINUTE)
    output = `il y'a ${Math.round(target / 1000)}s`;

  if (target >= MINUTE && target < HOUR)
    output = `il y'a ${Math.round(target / MINUTE)}min`;

  if (target >= HOUR && target < DAY)
    output = `il y'a ${Math.round(target / HOUR)}h`;

  if (target >= DAY && target < MONTH)
    output = `il y'a ${Math.round(target / DAY)} jours`;

  if (target >= MONTH && target < YEAR)
    output = `il y'a ${Math.round(target / MONTH)} mois`;

  if (target >= YEAR) output = `il y'a ${Math.round(target / YEAR)} ans`;

  return output;
}

function getTimeValue(time = 1000, target) {
  return {
    value: (time - (time % target)) / target,
    rest: time % target,
  };
}

/**
 * Return time of day format
 * @param {Number} time in milli-seconds
 */
export function getTime(time) {
  let output = "";
  const hour = getTimeValue(time, HOUR);
  const minute = getTimeValue(hour.rest, MINUTE);

  if (hour.value > 0) output += `${hour.value}h`;
  if (minute.value > 0) output += `${minute.value}mn`;
  if (minute.rest > 0) output += `${minute.rest / 1000}s`;

  return output;
}
