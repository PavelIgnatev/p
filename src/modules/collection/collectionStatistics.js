const { createTransport } = require("nodemailer");
const { api } = require("../../api");
const { getMoreProp } = require("../../helpers/getMoreProp");
const { getWeekday } = require("../../helpers/getWeekday");
const { readFile, writeFile } = require("../../utils/promisify");
const { getCurrencyRate } = require("../currencyRate/getCurrencyRate");
const {
  findTournamentWithDiapazone,
} = require("../../helpers/findTournamentWithDiapzone.js");
const { stopWordsPath } = require("../../constants");
const { sendStatistics } = require("../send/sendStatistics");
const { isRebuy } = require("../../helpers/isRebuy");

function parseсUTCToMilliseconds(datetimeStr) {
  const date = new Date(`${datetimeStr} UTC`);

  return date.getTime() / 1000 + 86400;
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

const collectionStatistics = async () => {
  const errorTournaments = {};

  try {
    const lastValue = await getCurrencyRate();
    const currentTime = new Date(
      new Date(Date.now() - 3 * 86400000).toLocaleString("en-EN", {
        timeZone: "UTC",
      })
    );
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth() + 1;
    const day = currentTime.getDate();
    const date = `${year}-${month}-${day}`;
    console.log(
      date,
      new Date(),
      "collection statistic",
      "ms: ",
      parseсUTCToMilliseconds(date)
    );
    const path = `src/store/copies/${date}`;
    const stateConfig = JSON.parse(await readFile(`${path}/config.json`));
    const config = JSON.parse(await readFile(`src/store/config/config.json`));
    const offpeak = JSON.parse(
      await readFile("src/store/offpeak/offpeak.json")
    );
    const stopWords = JSON.parse(await readFile(stopWordsPath));

    await Promise.all(
      Object.keys(stateConfig).map(async (alias) => {
        const configByAlias = stateConfig[alias];

        if (!configByAlias) return;

        if (!configByAlias?.address) {
          console.log(`У пользователя ${alias} нет адреса`);
          return;
        }

        const { networks } = configByAlias;

        let result;

        try {
          result = await api.get(
            `https://www.sharkscope.com/api/pocarrleaderboard/networks/Player Group/players/${alias}/completedTournaments?Order=Last,99&filter=Date:3d;Date:0~${parseсUTCToMilliseconds(
              date
            )}`
          );
        } catch (error) {
          console.log(error.message);
          console.log(`Алиас ${alias} вызвал ошибку шарскопа`);
        }

        if (result?.ErrorResponse?.Error?.$ === "Player group not found.") {
          if (config[alias]) delete config[alias];
          console.log(`Алиас ${alias} удален из базы`);
        }

        const tournaments =
          result?.PlayerResponse?.PlayerView?.PlayerGroup?.CompletedTournaments
            ?.Tournament ?? [];

        console.log(alias, "сыграл ", tournaments.length, " турниров");

        if (!tournaments?.length) {
          console.log("Игрок", alias, "без турниров", new Date());
        } else {
          // Фильтруем те, которые идут не в нужный день по таймзоне EST
          Array.from(tournaments).forEach((ft) => {

            const t = getMoreProp(ft);
            const network = t?.["@network"];

            if (
              networks?.["ko"]?.[network] &&
              networks?.["freezout"]?.[network]
            ) {
              const d = Number(ft["@duration"] ?? 0);
              const name = validateName(t["@name"]?.toLowerCase(), stopWords);
              const stake = t?.["@stake"];
              const { level: networksLevel, effmu } =
                networks?.[t["@bounty"] ? "ko" : "freezout"]?.[network] ?? {};
              const level = networksLevel + effmu;
              const currency = t["@currency"];
              const bid = t["@bid"];
              const isStartDate = Number(t["@date"] ?? 0);
              const ms = Number(`${isStartDate - d}000`);
              const st = new Date(ms);
              const yearStartDate = st.getFullYear();
              const monthStartDate = st.getMonth() + 1;
              const dayStartDate = st.getDate();
              const dateStartDate = `${yearStartDate}-${monthStartDate}-${dayStartDate}`;
              const filter = require(`../../store/copies/${dateStartDate}/filter`);
              const scores = require(`../../store/copies/${dateStartDate}/scores`);
              const scores1 = require(`../../store/copies/${dateStartDate}/score1.json`);

              const data = new Date(ms)
                .toLocaleString("en-EN", {
                  hour12: false,
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "numeric",
                  timeZone: "UTC",
                })
                .replace(", 24", ", 00")
                .split(", ");

              const dateHourMinute = new Date(Number(ms))
                .toLocaleString("en-EN", {
                  hour12: false,
                  hour: "numeric",
                  minute: "numeric",
                  timeZone: "UTC",
                })
                .replace("24:", "00:");
              const weekday = new Date(Number(ms)).toLocaleString("en-EN", {
                weekday: "long",
                timeZone: "UTC",
              });

              const pp = t["@prizepool"] >= 0 ? t["@prizepool"] : "-";
              t["@getWeekday"] = isStartDate ? getWeekday(ms) : "-";
              t["@realDuration"] = d;
              t["@alias"] = alias;
              t["@nickname"] =
                t?.["TournamentEntry"]?.["@playerName"] ?? "undefined";
              t["@prize"] = t?.["TournamentEntry"]?.["@prize"] ?? 0;
              t["@d"] = data[0];
              t["@times"] = data[1];
              t["@level"] = level;
              t["@multientries"] =
                t?.["TournamentEntry"]?.["@multientries"] ?? 0;
              t["@usdBid"] =
                currency === "CNY"
                  ? Math.round(Number(bid) / lastValue)
                  : Number(bid);
              t["@usdPrizepool"] =
                currency === "CNY" && pp !== "-"
                  ? Math.round(Number(pp) / lastValue)
                  : Number(pp);

              const reEntry = t?.["@multientries"];
              const totalEntrants =
                Number(t?.["@totalEntrants"] ?? 0) +
                Number(t?.["@reEntries"] ?? 0);
              t["@totalEntrants"] = totalEntrants;
              const od = t["@flags"]?.includes("OD");
              const sng = t["@gameClass"]?.includes("sng");
              const isNL = t["@structure"] === "NL";
              const isH = t["@game"] === "H";
              const rebuy = isRebuy(t);

              const isMandatoryСonditions =
                isNL && isH && !rebuy && !od && !sng;
              // Проверка isCan определяет игрока в боксе С при вхождении больше 1 раза и кол-во участников < 2000
              const isCan =
                effmu === "C" && totalEntrants < 2000 && reEntry > 0;

              let { valid } = filter.filter(level, offpeak, t, alias, true);

              let { score } =
                findTournamentWithDiapazone(
                  scores1?.[network]?.[weekday]?.[Number(stake).toFixed(2)]?.[
                    name
                  ],
                  `${dateHourMinute}:00`
                ) ?? {};

              if (!isMandatoryСonditions) {
                score = null;
              }

              const { score: score2 } = scores.scores(t?.["@level"], t, alias);

              t["score"] = score;
              t["score2"] = score2;

              if (score && score2 && score <= score2) {
                valid = true;
              }

              if (Number(bid) && (isCan || !valid)) {
                if (!errorTournaments[alias]) errorTournaments[alias] = [];
                errorTournaments[alias].push(t);
              }
            }
          });
        }
      })
    );

    console.log("Перезаписываю алиасы");
    await writeFile("src/store/config/config.json", JSON.stringify(config));
    try {
      const transporter = createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
        pool: true,
        tls: {
          minVersion: "TLSv1.2",
          rejectUnauthorized: true,
        },
      });

      await sendStatistics(errorTournaments, transporter);
      console.log("Начинаю удалять папку дня ", date);
      // await deleteFolder(`src/store/copies/${date}`);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log("При сборе данных для письма произошла ошибка", error);
    console.log(
      "Важно не забывать, что мы смотрим на 2 дня назад, так что возможно все заебись"
    );
  }
};

module.exports = { collectionStatistics };
