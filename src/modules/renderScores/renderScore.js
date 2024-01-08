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

const renderR = (config, score, renderAdd = true) => {
  const {
    type,
    values,
    offpeak,
    network,
    level: scoreLevel,
    KO,
    status,
    color,
  } = score;

  const indexPrizepool = config[type]
    ? config[type].findIndex((score) => score.placeholder === "Guarantee")
    : -1;

  values[indexPrizepool] = offpeak
    ? `isOffpeak && isGetTournaments ? 0 : ${values[indexPrizepool]}`
    : values[indexPrizepool];

  const level =
    scoreLevel[0] === "A" || scoreLevel[0] === "B"
      ? scoreLevel[0]
      : validateNumber(scoreLevel);
  const effMu = scoreLevel.replace(level, "").replace("-", "");

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
        (level === "1" && scoreLevel.includes("-")
          ? ""
          : `&& level === '${level}'`) +
        (effMu !== "all" ? `&& effmu === '${effMu}'` : "") +
        (status !== "all" ? `&& is${status}` : "") +
        (KO !== "all" ? `&& ${KO === "KO" ? "isKo" : "!isKo"}` : "")
      : "")
  );
};

function renderScore(score) {
  const {
    type,
    values,
    network,
    level: scoreLevel,
    KO,
    status,
    color,
    exceptions,
  } = score;
  const config = JSON.parse(
    fs.readFileSync("src/store/scores/config.json", "utf-8")
  );

  if (exceptions && Array.isArray(exceptions) && exceptions.length > 0) {
    return `(${exceptions
      .filter((e) => e.length === 2)
      .map((exception) => {
        const [first, second] = exception;

        return `(${renderR(
          config,
          { ...score, ...second },
          false
        )}) ? (${renderR(config, { ...score, ...first })}) : `;
      })
      .join("")} ${renderR(config, score)})`;
  }

  return renderR(config, score);
}

module.exports = { renderScore };
