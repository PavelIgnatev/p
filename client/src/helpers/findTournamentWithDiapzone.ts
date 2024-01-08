import { utcToMs } from "./utcToMs"

function findClosestTime(timeArray: string[], targetTime: string) {
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
    return ''; // если разница более 2 часов, возвращаем null
  }


  return closestTime;
}


export const findTournamentWithDiapzone = (tourpool: any, utcTime: string) => {
  if(!tourpool || !utcTime) {
    return null
  }
  
  return tourpool[findClosestTime(Object.keys(tourpool), utcTime)]
} 