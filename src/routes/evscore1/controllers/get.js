const { readFile } = require("../../../utils/promisify");

module.exports = async (req, res) => {
  let score1 = {};

  try {
    score1 = JSON.parse(await readFile("src/store/evscore/evscore.json"));
  } catch (e) {
    console.log(e);
  }

  res.status(200).send(score1);
};
