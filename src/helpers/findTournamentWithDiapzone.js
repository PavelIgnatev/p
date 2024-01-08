const utcToMs = (utc) => {
  const [hours, minutes, seconds] = utc.split(":").map(Number);

  return (hours * 3600 + minutes * 60 + seconds) * 1000;
};

function findClosestTime(timeArray, targetTime) {
  const targetMs = utcToMs(targetTime);
  let closestTime = timeArray[0];
  let closestMs = Math.abs(utcToMs(timeArray[0]) - targetMs);
  for (let i = 1; i < timeArray.length; i++) {
    const currentMs = Math.abs(utcToMs(timeArray[i]) - targetMs);
    if (currentMs < closestMs) {
      closestTime = timeArray[i];
      closestMs = currentMs;
    }
  }
  const closestMsFromTarget = Math.abs(utcToMs(closestTime) - targetMs);

  if (closestMsFromTarget > 2 * 3600 * 1000) {
    return "";
  }

  return closestTime;
}

const findTournamentWithDiapazone = (tourpool, utcTime) => {
  if (!tourpool || !utcTime) {
    return null;
  }

  return tourpool[findClosestTime(Object.keys(tourpool), utcTime)];
};

module.exports = { findTournamentWithDiapazone };
