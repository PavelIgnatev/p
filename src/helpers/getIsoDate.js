const getIsoDate = (offsetDays = 0) => {
  const currentTime = new Date(
    new Date(Date.now()).toLocaleString("en-EN", {
      timeZone: "UTC",
    })
  );

  // Добавляем оффсет в днях
  currentTime.setDate(currentTime.getDate() - offsetDays);

  const year = currentTime.getFullYear();
  const month = currentTime.getMonth() + 1;
  const day = currentTime.getDate();
  const date = `${year}-${month}-${day}`;
  return date;
};


module.exports = { getIsoDate };
