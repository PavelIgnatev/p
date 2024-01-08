export type TimeResult = {
  time: string;
  nextDay: boolean;
};

export const timeSum = (time1: string, time2: string): TimeResult => {
  const date1 = new Date(`1970-01-01T${time1}:00Z`);
  const date2 = new Date(`1970-01-01T${time2}:00Z`);

  const sum = date1.getTime() + date2.getTime() - new Date(`1970-01-01T00:00:00Z`).getTime();

  const resultDate = new Date(sum);

  const hours = resultDate.getUTCHours();
  const minutes = resultDate.getUTCMinutes();

  const nextDay = hours < date1.getUTCHours();

  return {
    time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
    nextDay: nextDay
  };
}

export const timeMinus = (time1: string, time2: string): TimeResult => {
  const date1 = new Date(`1970-01-01T${time1}:00Z`);
  const date2 = new Date(`1970-01-01T${time2}:00Z`);

  const difference = date1.getTime() - date2.getTime();

  const resultDate = new Date(difference);

  const hours = resultDate.getUTCHours();
  const minutes = resultDate.getUTCMinutes();

  const previousDay = hours > date1.getUTCHours();

  return {
    time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
    nextDay: previousDay
  };
}
