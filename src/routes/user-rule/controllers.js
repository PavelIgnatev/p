const { getRules } = require("../../utils/rules");
const { getScores } = require("../../utils/scores");

const get = async (req) => {
  const { alias } = req.query;

  const rules = await getRules();
  const scores = await getScores();

  return JSON.stringify({
    rules: rules.filter((rule) => {
      const isSome = rule.some((item) => {
        const { exceptions } = item;

        if (exceptions) {
          return exceptions.some((rules) =>
            rules.some(
              (item) =>
                item.type === "UserName" &&
                item.values.some((name) => name === alias)
            )
          );
        }
        return false;
      });

      return (
        isSome ||
        rule.some(
          (item) =>
            item.type === "UserName" &&
            item.values.some((name) => name === alias)
        )
      );
    }),
    scores: scores.filter((rule) => {
      const isSome = rule.some((item) => {
        const { exceptions } = item;

        if (exceptions) {
          return exceptions.some((rules) =>
            rules.some(
              (item) =>
                item.type === "UserName" &&
                item.values.some((name) => name === alias)
            )
          );
        }
        return false;
      });

      return isSome || rule.some(
        (item) =>
          item.type === "UserName" && item.values.some((name) => name === alias)
      );
    }),
  });
};

module.exports = { get };
