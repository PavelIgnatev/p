const { updtateAllCopies } = require("./updateAllCopies");
const { collectionStatistics } = require("../collection/collectionStatistics");
const { getRules } = require("../../utils/rules");
const { getScores } = require("../../utils/scores");
const { writeFile, readFile } = require("../../utils/promisify");
const { renderRules } = require("../../modules/render/renderRules");
const { renderScores } = require("../../modules/renderScores/renderScores");
const { updateTournaments } = require("./updateTournaments");
const { updateScore1 } = require("./updateScore1");
const { updateScore } = require("./updateScore");

const updateUrl = "src/store/update/update.json";

const updateServer = async () => {
  const { isUpdated } = JSON.parse(await readFile(updateUrl));

  if (isUpdated) {
    console.log("Сервер уже обновляется");
  }

  try {
    setTimeout(() => {
      writeFile(
        updateUrl,
        JSON.stringify({ isUpdated: true, timestamp: Date.now() })
      );
    }, 500);
  } catch (error) {
    console.log("Ошибка обновлении статуса обновления сервера: ", error);
  }

  // Обновление данных для папки Score
  try {
    await updateScore();
  } catch (error) {
    console.log("Ошибка при сохранении score");
  }

  try {
    const rules = await getRules();
    await renderRules(rules);
  } catch (error) {
    console.log("Ошибка при рендере правил: ", error);
  }

  try {
    const scores = await getScores();
    await renderScores(scores);
  } catch (error) {
    console.log("Ошибка при рендере правил: ", error);
  }

  // Обновление данных для писем на конркетный день
  try {
    await updtateAllCopies();
  } catch (error) {
    console.log("Ошибка при сохранении всех копий: ", error);
  }

  // Отправка писем
  try {
    console.log("Начинаю отправлять письма");
    // await collectionStatistics();
  } catch (error) {
    console.log("Ошибка при отправке писем: ", error);
  }

  // Обновление сервака
  try {
    console.log(`Начал обновление папки дней`);
    await updateTournaments();
    console.log(`Завершил обновление фильтрованного стейта`);

    console.log(`Начал обновление древовидного стейта по турнирам`);
    await updateScore1();
    console.log(`Обновил древовидный стейт по турнирам`);
  } catch (error) {
    console.log("Ошибка при обновлении сервера: ", error);
  }

  await writeFile(updateUrl, JSON.stringify({ isUpdated: false }));
};

module.exports = { updateServer };
