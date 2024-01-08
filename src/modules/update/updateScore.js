const mysql = require("mysql");
const { compress } = require("compress-json");
const { getIsoDate } = require("../../helpers/getIsoDate");
const { writeFile } = require("../../utils/promisify");
const { getNetwork } = require("../../helpers/getNetwork");

function getUnixTimestamp(data) {
  const date = new Date(data);
  const timestamp = Math.floor(date.getTime() / 1000);

  return timestamp;
}

const getScore = (dateStart, dateEnd) => {
  const networks = {};

  console.log("Начинаю получать score");
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: "vps92230.inmotionhosting.com",
      user: "pocarr5_GameSelectTool",
      password: "ukO4oqdtx8=:%IVm*jzI",
      database: "pocarr5_GameSelectTool",
    });

    connection.connect((err) => {
      if (err) {
        reject(err);
      }
      console.log(
        `SELECT * FROM CombinedTournamentData WHERE Tournament_Date >= ${getUnixTimestamp(
          dateStart
        )} AND Tournament_Date <= ${getUnixTimestamp(dateEnd)}`
      );
      const sqlQuery = `SELECT * FROM CombinedTournamentData WHERE Tournament_Date >= ${getUnixTimestamp(
        dateStart
      )} AND Tournament_Date <= ${getUnixTimestamp(dateEnd)}`;

      connection.query(sqlQuery, (error, results) => {
        if (error) {
          reject(error);
        }
        console.log(`Результат есть: ${Boolean(results)}`);
        results.forEach((tournament) => {
          const network = getNetwork(tournament.Network);

          if (networks[network]) {
            networks[network].push(tournament);
          } else {
            networks[network] = [tournament];
          }
        });

        connection.end((err) => {
          if (err) {
            reject(err);
          }

          console.log("Закончил получать score");
          resolve(networks);
        });
      });
    });
  });
};

async function getScoreWithRetry(attempts = 15, dateStart, dateEnd) {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let i = 0; i < attempts; i++) {
    try {
      const score = await getScore(dateStart, dateEnd);

      if (score !== undefined) {
        return score;
      }
    } catch (error) {
      console.error(
        `Ошибка при получении результата (попытка ${i + 1}): ${error.message}`
      );

      if (i === attempts - 1) {
        throw error;
      }
    }

    await delay(5000);
  }
}

const updateScore = async () => {
  // for (let i = 0; i < 90; i++) {
  const dateEnd = getIsoDate(2);
  const dateStart = getIsoDate(3);

  const score = await getScoreWithRetry(15, dateStart, dateEnd);

  console.log(`Начинаю записывать полученный score для дня ${dateEnd}`);
  try {
    await writeFile(
      `src/store/score/${dateEnd}.json`,
      JSON.stringify(compress(score))
    );
    console.log(`Закончил записывать полученный score для дня ${dateEnd}`);
  } catch (e) {
    console.error(
      `Не удалось записать полученный score для дня ${dateEnd}: ${e.message}`
    );
  }
  // }
};

module.exports = { updateScore };
