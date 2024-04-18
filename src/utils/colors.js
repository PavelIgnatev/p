const { readFile, writeFile } = require("../utils/promisify");
const { colorsPath } = require("../constants");

module.exports = {
  getColors: async () => JSON.parse(await readFile(colorsPath)),
  saveColors: async (sample) => writeFile(colorsPath, JSON.stringify(sample)),
};
