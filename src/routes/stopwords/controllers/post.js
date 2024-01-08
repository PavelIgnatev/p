const { updateScore1 } = require("../../../modules/update/updateScore1");
const { getStopWords, saveStopWords } = require("../../../utils/stopWords");

module.exports = async (req, res) => {
  const { word } = req.body;

  const words = await getStopWords();

  words.push(word);

  await saveStopWords(words);

  setTimeout(() => {
    updateScore1();
  }, 1000);

  res.status(200).send(words);
};
