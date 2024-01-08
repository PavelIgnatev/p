const { getScores, saveScores } = require("../../../utils/scores");
const { findInArray } = require("../../../helpers/findInArray");
const { renderScores } = require("../../../modules/renderScores/renderScores");

module.exports = async (req, res) => {
  const { scores: bodyScores, offpeak } = req.body;
  const scores = await getScores();
  const index = findInArray(scores, bodyScores);

  if (index === -1) {
    return res.status(400).send({ message: "Score not found" });
  }

  scores[index].map((score) => (score.offpeak = offpeak));

  await saveScores(scores);
  await renderScores(scores);

  res.status(200).send(scores);
};
