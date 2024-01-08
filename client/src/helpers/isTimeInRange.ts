export const isTimeInRange = (
  startDiapason: string,
  endDiapason: string,
  time: string
): boolean => {
  const [startHours, startMinutes] = startDiapason.split(':').map(Number);
  const [endHours, endMinutes] = endDiapason.split(':').map(Number);
  const [timeHours, timeMinutes] = time.split(':').map(Number);

  const startMinutesTotal = startHours * 60 + startMinutes;
  const endMinutesTotal = endHours * 60 + endMinutes + (endHours < startHours ? 24 * 60 : 0);
  const timeMinutesTotal = timeHours * 60 + timeMinutes + (timeHours < startHours ? 24 * 60 : 0);

  return timeMinutesTotal >= startMinutesTotal && timeMinutesTotal <= endMinutesTotal;
};
