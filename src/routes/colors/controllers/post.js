const { saveColors } = require("../../../utils/colors");

module.exports = async (req, res) => {
  const { colors } = req.body;
  console.log(colors)

  try {
    await saveColors(colors);

  } catch (error) {
    console.log("При обновлении сервера произошла ошибка", error);
  }

  return res.status(200).send();
};
