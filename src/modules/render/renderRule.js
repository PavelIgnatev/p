const fs = require("fs");
const {
  timeStringToMilliseconds,
} = require("../../helpers/timeStringToMilliseconds");

const validateNumber = (value) => {
  return value
    .replace(/[^\d.]*/g, "")
    .replace(/([.])[.]+/g, "$1")
    .replace(/^[^\d]*(\d+([.]\d{0,5})?).*$/g, "$1");
};

const renderR = (config, rule, renderAdd = true) => {
  const {
    type,
    values,
    offpeak,
    network,
    level: ruleLevel,
    KO,
    status,
    color,
  } = rule;

  const indexPrizepool = config[type]
    ? config[type].findIndex((rule) => rule.placeholder === "Guarantee")
    : -1;

  values[indexPrizepool] = offpeak
    ? `isOffpeak && isGetTournaments ? 0 : ${values[indexPrizepool]}`
    : values[indexPrizepool];

  const level =
    ruleLevel[0] === "A" || ruleLevel[0] === "B"
      ? ruleLevel[0]
      : validateNumber(ruleLevel);
  const effMu = ruleLevel.replace(level, "").replace("-", "");

  return (
    `(${type}(${values
      .map((value, i) => {
        if (config[type][i].type === "time") {
          return timeStringToMilliseconds(value);
        }

        return (config[type][i].type === "string" ||
          config[type][i].type === "UserName") &&
          indexPrizepool !== i
          ? `"${value}"`
          : indexPrizepool !== i
          ? Number(value)
          : value;
      })
      .join(",")}))` +
    (renderAdd
      ? (network !== "all" ? `&& network === '${network}'` : "") +
        (level === "1" && ruleLevel.includes("-")
          ? ""
          : `&& level === '${level}'`) +
        (effMu !== "all" ? `&& effmu === '${effMu}'` : "") +
        (status !== "all" ? `&& is${status}` : "") +
        (KO !== "all" ? `&& ${KO === "KO" ? "isKo" : "!isKo"}` : "") +
        (color === "green" || color === "brown" ? `&& isGetTournaments` : "")
      : "")
  );
};
function renderRule(rule) {
  const { exceptions, offpeak } = rule;

  const config = JSON.parse(
    fs.readFileSync("src/store/rules/config.json", "utf-8")
  );

  if (exceptions && Array.isArray(exceptions) && exceptions.length > 0) {
    return `(${exceptions
      .filter((e) => e.length === 2)
      .map((exception) => {
        const [first, second] = exception;

        return `(${renderR(
          config,
          { ...second, offpeak },
          false
        )}) ? (${renderR(config, { ...first, offpeak })}) : `;
      })
      .join("")} ${renderR(config, rule)})`;
  }

  return renderR(config, rule);
}

module.exports = { renderRule };
