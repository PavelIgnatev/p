const fs = require("fs");

function renderCheck(scores, scoreString) {
  const score = Number(scores[0].values[0]);
  const { exceptions, color } = scores[0];

  return `if(${scoreString}) {
    return {
      score: ${
        exceptions && Array.isArray(exceptions) && exceptions.length > 0
          ? `${exceptions
              .filter((e) => e.length === 2)
              .map((exception) => {
                const [first, second] = exception;
                const scoreExc = first.values[0];
                const name = second.values[0];

                return `UserName("${name}") ? ${scoreExc} : `;
              })
              .join("")} ${score}`
          : score
      },
      color: "${color}", ruleString: ${JSON.stringify(scoreString)}
    };
  };\n`;
}

module.exports = { renderCheck };
