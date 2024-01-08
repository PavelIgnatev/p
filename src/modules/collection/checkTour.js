const { getMoreProp } = require("../../helpers/getMoreProp");
const { getWeekday } = require("../../helpers/getWeekday");
const { readFile } = require("../../utils/promisify");
const { getCurrencyRate } = require("../currencyRate/getCurrencyRate");
const {
  findTournamentWithDiapazone,
} = require("../../helpers/findTournamentWithDiapzone.js");
const { stopWordsPath } = require("../../constants");

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
  const stopWords = JSON.parse(await readFile(stopWordsPath));

  [{
    "@duration": "04:56:15",
    "@date": "1683230487",
    "@prizePool": "5280.0",
    "@reEntries": "37",
    "@tickets": "0",
    "@currency": "USD",
    "@filterString": "Class:SCHEDULED;Type:H,NL,N,B;Type!:R;StakePlusRake:USD22",
    "@flags": "B,ME",
    "@game": "H",
    "@gameClass": "scheduled",
    "@id": "362317834",
    "@guarantee": "5000.0",
    "@name": "Daily Legends 6-Max PKO: $5K Gtd",
    "@network": "Party",
    "@playersPerTable": "7",
    "@rake": "2.0",
    "@stake": "20.0",
    "@state": "Completed",
    "@structure": "NL",
    "@totalEntrants": 264,
    "TournamentEntry": {
        "@multientries": "1",
        "@playerName": "Wang wei",
        "@position": "92"
    },
    "@bid": "22.00",
    "@turbo": false,
    "@rebuy": false,
    "@od": false,
    "@sat": false,
    "@bounty": true,
    "@sng": false,
    "@deepstack": false,
    "@superturbo": false,
    "@prizepool": 5280,
    "@getWeekday": "Thursday",
    "@realDuration": 17775,
    "@alias": "Trem_mineiro_pocarr",
    "@nickname": "Wang wei",
    "@prize": 0,
    "@d": "May 4",
    "@times": "15:05",
    "@level": "7C",
    "@multientries": "1",
    "@usdBid": 22,
    "@usdPrizepool": 5280,
    "score": 70,
    "score2": 72
}].forEach((ft) => {
    const t = getMoreProp(ft);
    const network = t?.["@network"];
    const d = Number(ft["@realDuration"] ?? 0);
    const name = validateName(t["@name"]?.toLowerCase(), stopWords);
    const stake = t?.["@stake"];
    const currency = t["@currency"];
    const bid = t["@bid"];
    const isStartDate = Number(t["@date"] ?? 0);
    const ms = Number(`${isStartDate - d}000`);
    const st = new Date(ms);
    const yearStartDate = st.getFullYear();
    const monthStartDate = st.getMonth() + 1;
    const dayStartDate = st.getDate();
    const dateStartDate = `${yearStartDate}-${monthStartDate}-${dayStartDate}`;
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

    const dateHourMinuteSecond = new Date(Number(ms))
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
    t["@nickname"] = t?.["TournamentEntry"]?.["@playerName"] ?? "undefined";
    t["@prize"] = t?.["TournamentEntry"]?.["@prize"] ?? 0;
    t["@d"] = data[0];
    t["@times"] = data[1];
    t["@multientries"] = t?.["TournamentEntry"]?.["@multientries"] ?? 0;
    t["@usdBid"] =
      currency === "CNY" ? Math.round(Number(bid) / lastValue) : Number(bid);
    t["@usdPrizepool"] =
      currency === "CNY" && pp !== "-"
        ? Math.round(Number(pp) / lastValue)
        : Number(pp);
    
    let { score } =
      findTournamentWithDiapazone(
        scores1?.[network]?.[weekday]?.[Number(stake).toFixed(2)]?.[name],
        dateHourMinuteSecond
      ) ?? {};

    const { score: score2 } = scores.scores(t?.["@level"], t);

    t["score"] = score;
    t["score2"] = score2;

    console.log(t);
  });
};

