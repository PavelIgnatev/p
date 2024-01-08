import { TimeResult } from "./timeSum";

export const timeDifference = (time1: string, time2: string): TimeResult => {
  const date1 = new Date(`1970-01-01T${time1}:00Z`);
  const date2 = new Date(`1970-01-01T${time2}:00Z`);
  
  const isNextDay = date2.getTime() < date1.getTime();

  return {
      time: time2,
      nextDay: isNextDay
  };
}