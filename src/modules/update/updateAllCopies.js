const fs = require("fs");
const { getConfig } = require("../../utils/config");
const { readFile } = require("../../utils/promisify");
const { updateCopies } = require("./updateCopies");

async function readFileAndSaveAsNewFile(sourceFile, newFileName) {
  try {
    const data = await fs.promises.readFile(sourceFile);
    await fs.promises.writeFile(newFileName, data);
  } catch (err) {
    console.error(err);
  }
}

const updtateAllCopies = async () => {
  try {
    const config = await getConfig();
    const score1 = JSON.parse(await readFile("src/store/score1/score1.json"));

    console.log(`Начал копировать config.json`);
    await updateCopies(config, "config.json");
    console.log(`Завершил копировать config.json`);

    console.log(`Начал копировать score1.json`);
    await updateCopies(score1, "score1.json");
    console.log(`Завершил копировать score1.json`);

    console.log(`Начал копировать scores.json`);
    const currentTime = new Date(Date.now() - 86400000);
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth() + 1;
    const day = currentTime.getDate();
    const date = `${year}-${month}-${day}`;

    console.log(`Начал копировать frontScores.json`);
    await readFileAndSaveAsNewFile(
      "src/modules/filter/frontScores.js",
      `src/store/copies/${date}/scores.js`
    );
    console.log(`Завершил копировать frontScores.json`);

    console.log(`Начал копировать frontFilter.json`);
    await readFileAndSaveAsNewFile(
      "src/modules/filter/frontFilter.js",
      `src/store/copies/${date}/filter.js`
    );
    console.log(`Завершил копировать frontFilter.json`);
  } catch (error) {
    console.log("Ошибка при сохранении всех копий: ", error);
  }
};

module.exports = { updtateAllCopies };
