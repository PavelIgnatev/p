const { findInArray } = require("../../../helpers/findInArray");
const { renderScores } = require("../../../modules/renderScores/renderScores");

const { getScores, saveScores } = require("../../../utils/scores");

module.exports = async (req, res) => {
  const data = req.body;

  const scores = await getScores();
  const index = findInArray(scores, data);

  if (index !== -1) {
    scores.splice(index, 1);
  }

  await saveScores(scores);
  await renderScores(scores);

  res.status(200).send(scores);
};
