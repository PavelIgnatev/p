const { updateScore1 } = require("../../../modules/update/updateScore1");
const { getStopWords, saveStopWords } = require("../../../utils/stopWords");

module.exports = async (req, res) => {
  const { word: deleteWord } = req.body;

  const words = await getStopWords();
  const index = words.findIndex((word) => word === deleteWord);

  if (index !== -1) {
    words.splice(index, 1);
  }

  await saveStopWords(words);

  setTimeout(() => {
    updateScore1();
  }, 1000);

  res.status(200).send(words);
};
