const { writeFile } = require("../../utils/promisify");
const { renderCheck } = require("./renderCheck");
const { renderCheckFalse } = require("./renderCheckFalse");
const { renderScore } = require("./renderScore");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

function customSort(a, s) {
  return a.sort(function (x1, x2) {
    var i1 = s.indexOf(x1[0].color),
      i2 = s.indexOf(x2[0].color);
    return i1 < 0 ? 1 : i2 < 0 ? -1 : i1 - i2;
  });
}

function customSort2(a, s) {
  let result = [];
  let delayed = [];

  for (let i = 0; i < a.length; i++) {
    let item = a[i];
    if (item[0].color === "orange" || !s.includes(item?.[1]?.type)) {
      result.push(item);
    } else {
      delayed.push(item);
    }
  }

  return [...result, ...delayed];
}
async function renderScores(scores) {
  const nativeScores = [...scores];
  customSort(nativeScores, [
    "green",
    "orange",
    "brown",
    "blue",
    "red",
    "black",
  ]);
  const sortedScores = customSort2(nativeScores, ["FromTo", "BidGt"]);

  const result = `const { getNetwork } = require("../../helpers/getNetwork");
  const {
    FromTo: FromToQ,
    FromToName: FromToNameQ,
    BidGt: BidGtQ,
    BidGtName: BidGtNameQ,
    Ticket: TicketQ,
    BidName: BidNameQ,
    Name: NameQ,
    Score: ScoreQ,
    StartRegEqual: StartRegEqualQ,
    StartRegFrom: StartRegFromQ,
    StartRegTo: StartRegToQ,
    UserName: UserNameQ,
    FromToGt: FromToGtQ,
    StartDay: StartDayQ,
    NotName: NotNameQ,
    Entrants: EntrantsQ,
    FLAGS: FLAGSQ,
  } = require("../../helpers/curry");
  const { isSuperTurbo: isSuperTurboS } = require("../../helpers/isSuperTurbo");
  const { isTurbo: isTurboS } = require("../../helpers/isTurbo");
  const { isNormal: isNormalS } = require("../../helpers/isNormal")
  const {validateNumber} = require('../../helpers/validateNumber')
  
  const scores = (scoreLevel, tournament, alias) => {
    const name = tournament["@name"]?.toLowerCase(),
      network = getNetwork(tournament["@network"]),
      bid = Number(tournament["@usdBid"]),
      prizepool = Math.round(Number(tournament["@usdPrizepool"])),
      weekDay = tournament["@getWeekday"],
      FromTo = FromToQ(bid),
      FromToName = FromToNameQ(name)(bid),
      BidGt = BidGtQ(bid)(prizepool),
      BidGtName = BidGtNameQ(name)(bid)(prizepool),
      FromToGt = FromToGtQ(bid)(prizepool),
      Ticket = TicketQ(name)(bid)(tournament["@tickets"] ?? 0),
      Entrants = EntrantsQ(tournament?.["@totalEntrants"] ?? 0),
      BidName = BidNameQ(name)(bid),
      StartDay = StartDayQ(weekDay),
      Name = NameQ(name),
      Score = ScoreQ,
      StartRegEqual = StartRegEqualQ(tournament["@msStartForRule"]),
      StartRegFrom = StartRegFromQ(tournament["@msStartForRule"]),
      StartRegTo = StartRegToQ(tournament["@msStartForRule"]),
      UserName = UserNameQ(alias),
      NotName = NotNameQ(name),
      FLAGS = FLAGSQ(tournament);

    const isTurbo = isTurboS(tournament);
    const isSuperTurbo = isSuperTurboS(tournament);
    const isKo = isNormalS(tournament);
    const isNormal = !isTurbo && !isSuperTurbo;

    const level = (scoreLevel[0] === 'A' || scoreLevel[0] === 'B')? scoreLevel[0] : validateNumber(scoreLevel);
    const effmu = scoreLevel.replace(level, "").replace("-", "");
  
    if (!name || !bid) return { score: null };


    ${sortedScores
      .map((score) => {
        if (score[0].color === "orange") {
          return renderCheckFalse(score.map(renderScore).join(" && "));
        }

        return renderCheck(score, score.slice(1).map(renderScore).join(" && "));
      })
      .join("")}
    
    
    return { score: null };
  };
  
  module.exports = {
    scores,
  };`;
  await writeFile("src/modules/filter/scores.js", result);
  await exec("rollup --config rollup2.config.mjs --bundleConfigAsCjs");
}
module.exports = { renderScores };
