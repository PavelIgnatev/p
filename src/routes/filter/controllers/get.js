const { readFile } = require("../../../utils/promisify");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  try {
    const filter = await readFile("src/modules/filter/frontFilter.js");
    const scores = await readFile("src/modules/filter/frontScores.js");

    return res.send({
      filter,
      scores
    });
  } catch (e) {
    console.log(e);
    res.status(404).send(null);
  }
  res.status(404).send(null);
};
