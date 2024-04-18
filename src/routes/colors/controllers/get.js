const { getColors } = require("../../../utils/colors");

module.exports = async (req, res) => {
  const sample = await getColors();

  res.status(200).send(sample);
};
