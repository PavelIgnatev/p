const { getStopWords } = require("../../../utils/stopWords");

module.exports = async (req, res) => {
  const words = await getStopWords();

  res.status(200).send(words);
};
