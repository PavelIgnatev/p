const { writeFile } = require("../../utils/promisify");
const { renderCheck } = require("./renderCheck");
const { renderCheckFalse } = require("./renderCheckFalse");
const { renderRule } = require("./renderRule");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

function customSort(a, s) {
  return a.sort(function (x1, x2) {
    var i1 = s.indexOf(x1[0].color),
      i2 = s.indexOf(x2[0].color);
    return i1 < 0 ? 1 : i2 < 0 ? -1 : i1 - i2;
  });
}

async function renderRules(rules) {
  const nativeRules = [...rules];
  customSort(nativeRules, ["green", "orange", "blue", "red", "brown", "black"]);
  const result = `const { getNetwork } = require("../../helpers/getNetwork");
  const {
    FromTo: FromToQ,
    FromToName: FromToNameQ,
    BidGt: BidGtQ,
    BidGtName: BidGtNameQ,
    Ticket: TicketQ,
    BidName: BidNameQ,
    Name: NameQ,
    FromToGt: FromToGtQ,
    StartDay: StartDayQ,
    ScoreEqual: ScoreEqualQ,
    ScoreFrom: ScoreFromQ,
    ScoreTo: ScoreToQ,
    StartRegEqual: StartRegEqualQ,
    UserName: UserNameQ,
    StartRegFrom: StartRegFromQ,
    StartRegTo: StartRegToQ,
    NotName: NotNameQ,
    Entrants: EntrantsQ,
    FLAGS: FLAGSQ,
  } = require("../../helpers/curry");
  const { isSuperTurbo: isSuperTurboS } = require("../../helpers/isSuperTurbo");
  const { isTurbo: isTurboS } = require("../../helpers/isTurbo");
  const { isNormal: isNormalS } = require("../../helpers/isNormal")
  const { isOffpeak: isOffpeakQ } = require("../../helpers/isOffpeak");
  const {validateNumber} = require('../../helpers/validateNumber')
  
  const filter = (ruleLevel, offpeak, tournament, alias, isGetTournaments = false) => {
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
      ScoreEqual = ScoreEqualQ(tournament["@score"] ?? 0),
      ScoreFrom = ScoreFromQ(tournament["@score"] ?? 0),
      ScoreTo = ScoreToQ(tournament["@score"] ?? 0),
      StartRegEqual = StartRegEqualQ(tournament["@msStartForRule"]),
      UserName = UserNameQ(alias),
      StartRegFrom = StartRegFromQ(tournament["@msStartForRule"]),
      StartRegTo = StartRegToQ(tournament["@msStartForRule"]),
      NotName = NotNameQ(name),
      FLAGS = FLAGSQ(tournament);


    const isTurbo = isTurboS(tournament);
    const isOffpeak = isOffpeakQ(tournament, offpeak, Number(tournament['@realDuration'] ?? 0) * 1000);
    const isSuperTurbo = isSuperTurboS(tournament);
    const isKo = isNormalS(tournament);
    const isNormal = !isTurbo && !isSuperTurbo;

    const level = (ruleLevel[0] === 'A' || ruleLevel[0] === 'B')? ruleLevel[0] : validateNumber(ruleLevel);
    const effmu = ruleLevel.replace(level, "").replace("-", "");
  
    if (!name || !bid) return { valid: false, guarantee: 1, rules: false };


    ${nativeRules
      .map((rule) => {
        if (rule[0].color === "orange") {
          return renderCheckFalse(rule.map(renderRule).join(" && "));
        }

        return renderCheck(rule, rule.map(renderRule).join(" && "));
      })
      .join("")}
    
    return { valid: false, guarantee: 1, rules: false };
  };
  
  module.exports = {
    filter,
  };`;
  await writeFile("src/modules/filter/filter.js", result);
  await exec("rollup --config rollup.config.mjs --bundleConfigAsCjs");
}
module.exports = { renderRules };
