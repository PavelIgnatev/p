export const utcToMs = (utc: string) => {
  const [hours, minutes, seconds] = utc.split(':').map(Number);
  
  return ((hours * 3600) + (minutes * 60) + seconds) * 1000
}