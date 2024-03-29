/**
 * Возвращае true, если турнир является satellite
 * @param {Object} tournament Экземпляр объекта tournament
 * @return {boolean} True, если турнир является super turbo
 */

const { getNetwork } = require("./getNetwork");

const isSat = (tournament) => {
  const name = tournament["@name"]?.toLowerCase();
  const network = getNetwork(tournament["@network"]);
  let sat = network !== "WNMX" ? !!tournament["@flags"]?.includes("SAT") : false;

  if (!sat && name) {
    if (network === "GG") {
      sat =
        name.includes(" seats") ||
        name.includes("seats ") ||
        name.includes(" seat") ||
        name.includes("seat ") ||
        name.includes(" qualifier") ||
        name.includes("qualifier ") ||
        name.includes(" step") ||
        name.includes("step ") ||
        (name.includes(" sat") && !name.includes(" satu")) ||
        name.includes("sat  ");
    } else if (network === "WNMX") {
      sat =
        (name.includes(" sat") && !name.includes(" satu")) ||
        name.includes("sat  ") ||
        name.includes("satellite") ||
        name.includes("qualif") ||
        name.includes("last chance") ||
        name.includes("hit&run");
    } else if (network === "WPN") {
      sat =
        (name.includes(" sat") && !name.includes(" satu")) ||
        name.includes("sat  ") ||
        name.includes("satellite") ||
        name.includes("ticket") ||
        name.includes("seat") ||
        name.includes(" qualifier") ||
        name.includes("qualifier ");
    } else if (network === "IP") {
      sat =
        name.includes("ticket") ||
        name.includes("ticket") ||
        name.includes(" seats") ||
        name.includes("seats ") ||
        (name.includes(" sat") && !name.includes(" satu")) ||
        name.includes("sat  ");
    }
  }

  return !!sat;
};

module.exports = { isSat };
