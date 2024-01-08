const { readFile, writeFile } = require("./promisify");
const { scoresPath } = require("../constants");
const { filterRules } = require("../helpers/filterRules");

module.exports = {
  getScores: async () => JSON.parse(await readFile(scoresPath)),
  saveScores: async (scores) => writeFile(scoresPath, JSON.stringify(scores).replace("]]]", "]]")),
  getFiltredScores: async (color, level, network, status, KO) => {
    const scores = JSON.parse(await readFile(scoresPath));

    return scores.filter((score) => filterRules(score[0], color, level, network, status, KO));
  },
};
