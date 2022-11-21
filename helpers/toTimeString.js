export default function toTimeString(time) {
  const targetTime = new Date(time).getTime();
  const currentTime = Date.now();
  const target = currentTime - targetTime;

  let output = "";
  if (target <= 1000) output = "il y'a 1s";

  if (target > 1000 && target < 60 * 1000)
    output = `il y'a ${Math.round(target / 1000)}s`;

  if (target >= 1000 * 60 && target < 1000 * 60 * 60)
    output = `il y'a ${Math.round(target / (1000 * 60))}min`;

  if (target >= 1000 * 60 * 60 && target < 1000 * 60 * 60 * 24)
    output = `il y'a ${Math.round(target / (1000 * 60 * 60))}h`;

  if (target >= 1000 * 60 * 60 * 24 && target < 1000 * 60 * 60 * 24 * 30)
    output = `il y'a ${Math.round(target / (1000 * 60 * 60 * 24))} jours`;

  if (
    target >= 1000 * 60 * 60 * 24 * 30 &&
    target < 1000 * 60 * 60 * 24 * 30 * 12
  )
    output = `il y'a ${Math.round(target / (1000 * 60 * 60 * 24 * 30))} mois`;

  if (target >= 1000 * 60 * 60 * 24 * 30 * 12)
    output = `il y'a ${Math.round(
      target / (1000 * 60 * 60 * 24 * 30 * 12)
    )} ans`;

  return output;
}
