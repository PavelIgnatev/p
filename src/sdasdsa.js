function divideNetworks(obj) {
  const updatedObj = { ...obj }; // Создаем копию исходного объекта

  // Для каждого пользователя в объекте
  for (const userKey in updatedObj) {
    const user = updatedObj[userKey];
    const networks = user.networks;
    const koNetworks = {};
    const freezoutNetworks = {};

    // Разделяем сети на "ko" и "freezout" и копируем данные
    for (const networkKey in networks) {
      koNetworks[networkKey] = { ...networks[networkKey] };
      freezoutNetworks[networkKey] = { ...networks[networkKey] };
    }

    // Добавляем разделенные сети обратно в объект
    user.networks = {
      ko: koNetworks,
      freezout: freezoutNetworks,
    };
  }

  return updatedObj;
}
