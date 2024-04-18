const { updateScore1 } = require("../../../modules/update/updateScore1");
const { saveSample } = require("../../../utils/sample");

module.exports = async (req, res) => {
  const { sample } = req.body;

  try {
    await saveSample({ count: Number(sample) });

    updateScore1()
  } catch (error) {
    console.log("При обновлении сервера произошла ошибка", error);
  }

  return res.status(200).send();
};
