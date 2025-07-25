const { getTimeBySec } = require("./getTimeBySec");
const { isTurbo } = require("./isTurbo");
const { getNetwork } = require("./getNetwork");
const { isSuperTurbo } = require("./isSuperTurbo");
const { isRebuy } = require("./isRebuy");
const { isSat } = require("./IsSat");
const { isNormal } = require("./isNormal");
const { isMystery } = require("./isMystery");

/**
 * Возвращает объект, содержащий в себе большее количество свойств
 * @param {Object} tournament Экземпляр объекта tournament
 * @return {Object} Объект, содержащий в себе большее количество свойств
 */

const getMoreProp = (tournament) => {
  const name = tournament["@name"]?.toLowerCase();
  const network = getNetwork(tournament["@network"]);
  const stake = Number(tournament["@stake"] ?? 0);
  const rake = Number(tournament["@rake"] ?? 0);
  const bid = (stake + rake).toFixed(2);
  const sat = isSat(tournament);

  //Фикс гарантии для WPN и 888Poker и Chiko
  if (network === "WPN" || network === "888" || network === "Chico") {
    const $ = tournament["@name"].split("$");
    if ($.length > 1) {
      if (network === "Chico" && !sat) {
        if (typeof +$[1][0] === "number") {
          tournament["@guarantee"] = $[1]
            ?.split(" ")[0]
            ?.replace(")", "")
            ?.replace(",", "")
            ?.replace(",", "")
            ?.replace(",", "");
        } else {
          tournament["@guarantee"] = $[2]
            ?.split(" ")?.[0]
            ?.replace(",", "")
            ?.replace(",", "")
            ?.replace(",", "")
            ?.replace(".5K", "500")
            ?.replace("K", "000")
            ?.replace("M", "000000")
            ?.replace(".", "")
            ?.replace(".", "")
            ?.replace(".", "");
        }
      } else if ((network === "WPN" && !sat) || network === "888") {
        tournament["@guarantee"] = $[1]
          ?.split(" ")[0]
          ?.replace(")", "")
          ?.replace(",", "")
          ?.replace(",", "")
          ?.replace(",", "");
      }
    }
  }

  const prizepool = Math.round(
    Math.max(
      Number(tournament["@guarantee"] ?? 0),
      Number(tournament["@prizePool"] ?? 0),
      (Number(tournament["@entrants"] ?? 0) +
        Number(tournament["@reEntries"] ?? 0)) *
        Number(tournament["@stake"] ?? 0),
      (Number(tournament["@totalEntrants"] ?? 0) +
        Number(tournament["@reEntries"] ?? 0)) *
        Number(tournament["@stake"] ?? 0)
    )
  );

  const rebuy = isRebuy(tournament);
  const normal = isNormal(tournament);
  const mystery = isMystery(tournament);

  return {
    ...tournament,
    "@bid": bid,
    "@turbo": !!isTurbo(tournament),
    "@rebuy": rebuy,
    "@od": !!tournament["@flags"]?.includes("OD"),
    "@sat": !!sat,
    "@bounty": !!normal || !!mystery,
    "@mystery": !!mystery,
    "@sng": !!tournament["@gameClass"]?.includes("sng"),
    "@deepstack": !!tournament["@flags"]?.includes("D"),
    "@superturbo": !!isSuperTurbo(tournament),
    "@prizepool": prizepool >= 0 ? prizepool : "-",
    "@network": network,
    "@duration": tournament["@duration"]
      ? getTimeBySec(tournament["@duration"])
      : "-",
  };
};

module.exports = { getMoreProp };
