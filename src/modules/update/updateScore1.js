const { readFile, writeFile } = require("../../utils/promisify");
const { getNetwork } = require("../../helpers/getNetwork");
const { stopWordsPath } = require("../../constants");
const { getScores } = require("../../helpers/getScores");
const { getStatus } = require("../../helpers/getStatus");
const { getSample } = require("../../utils/sample");

function calculateAverageDifficulty(data, count) {
  const maxBet = Math.max(...Object.keys(data).map(Number));
  const percent = count / 100;

  const result = {};

  for (let i = 1; i <= maxBet; i++) {
    let count = 0;
    let sum = 0;
    const minBet = i * (1 - percent);
    const maxPotentialBet = i * (1 + percent);

    for (const key in data) {
      const bet = parseInt(key);
      if (bet >= minBet && bet <= maxPotentialBet) {
        sum += data[key];
        count++;
      }
    }

    const average = count ? sum / count : 0;
    result[i] = Math.round(average);
  }

  return result;
}

const validateName = (name, stopWords) => {
  if (!name) return null;
  else name = name.toLowerCase();

  const cleanedName = name.replace(/[^\w]/gi, "").replace(/\d+/g, "");

  stopWords.forEach((word) => {
    cleanedName.replace(word, "");
  });

  return cleanedName;
};

const updateScore1 = async () => {
  try {
    const scores = getScores();
    const stopWords = JSON.parse(await readFile(stopWordsPath));

    const obj = {};

    Object.values(scores).forEach((networks) => {
      Object.keys(networks).forEach((networkName) => {
        networks[networkName].forEach((tournament) => {
          const duration = tournament["Duration"];
          const score = tournament["score"];
          const name = validateName(tournament["Name"], stopWords);
          const network = getNetwork(networkName);
          const bid = Number(tournament["Buy_In"]).toFixed(2);
          const time = tournament["StartTimeUTC"];
          const dayOfWeek = tournament["DoW"];

          if (!name || !network || !bid || !time || !dayOfWeek) {
            return;
          }

          if (!obj[network]) obj[network] = {};
          if (!obj[network][dayOfWeek]) obj[network][dayOfWeek] = {};
          if (!obj[network][dayOfWeek][bid]) obj[network][dayOfWeek][bid] = {};
          if (!obj[network][dayOfWeek][bid][name])
            obj[network][dayOfWeek][bid][name] = {};
          if (!obj[network][dayOfWeek][bid][name][time]) {
            obj[network][dayOfWeek][bid][name][time] = {
              score: [],
              duration: [],
            };
          }

          const scores = obj[network][dayOfWeek][bid][name][time]["score"];
          const durations =
            obj[network][dayOfWeek][bid][name][time]["duration"];

          if (score && scores.length < 3) scores.push(score);
          if (duration && durations.length < 3) durations.push(duration);
        });
      });
    });

    Object.keys(obj).forEach((day) => {
      Object.keys(obj[day]).forEach((time) => {
        Object.keys(obj[day][time]).forEach((bid) => {
          Object.keys(obj[day][time][bid]).forEach((name) => {
            Object.keys(obj[day][time][bid][name]).forEach((dayOfWeek) => {
              Object.keys(obj[day][time][bid][name][dayOfWeek]).forEach(
                (info) => {
                  const values = obj[day][time][bid][name][dayOfWeek][info];
                  const length = values.length || 1;

                  obj[day][time][bid][name][dayOfWeek][info] = Math.round(
                    Number(values.reduce((r, i) => r + Number(i), 0) / length)
                  );
                }
              );
            });
          });
        });
      });
    });

    await writeFile("src/store/score1/score1.json", JSON.stringify(obj));

    const evObj = {};
    Object.values(scores)
      .slice(0, 30)
      .forEach((networks) => {
        Object.keys(networks).forEach((networkName) => {
          networks[networkName].forEach((tournament) => {
            const score = tournament["score"];
            const network = getNetwork(networkName);
            const bid = Math.ceil(Number(tournament["Buy_In"]));
            const status = getStatus({
              ...tournament,
              "@name": tournament.Name,
              "@flags": tournament.Flags,
              "@network": tournament.Network,
            });

            if (
              !network ||
              !bid ||
              !status ||
              network === "IP" ||
              network === "Party"
            ) {
              return;
            }

            if (!evObj) evObj = {};
            if (!evObj[status]) evObj[status] = {};
            if (!evObj[status][bid]) evObj[status][bid] = [];

            if (score) evObj[status][bid].push(score);
          });
        });
      });

    Object.keys(evObj).forEach((status) => {
      Object.keys(evObj[status]).forEach((bid) => {
        const values = evObj[status][bid];
        const length = values.length || 1;

        evObj[status][bid] = Math.round(
          Number(values.reduce((r, i) => r + Number(i), 0) / length)
        );
      });
    });

    await writeFile(
      "src/store/evscore/prev_evscore.json",
      JSON.stringify(evObj)
    );

    const sample = await getSample();
    const { count = 0 } = sample || { count: 0 };

    Object.keys(evObj).forEach((status) => {
      evObj[status] = calculateAverageDifficulty(evObj[status], count);
    });

    await writeFile("src/store/evscore/evscore.json", JSON.stringify(evObj));
  } catch (error) {
    console.log(error);
  }
};

module.exports = { updateScore1 };
