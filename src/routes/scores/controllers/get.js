const { getFiltredScores } = require("../../../utils/scores");

module.exports = async (req, res) => {
  const { color, level, network, status, KO } = req.query;
  const scores = await getFiltredScores(color, level, network, status, KO);

  res.status(200).send(scores);
};
