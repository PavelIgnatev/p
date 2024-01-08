import { rulesModel } from "../../../@types/rulesModel";
import { scoresModel } from "../../../@types/scoreModel";
import { getUniqueElemKeyGetter } from "../../../helpers/getUniqueElemKeyGetter";
import {
  getLvlAndEffmu,
  LevelAndEffmuValidate,
} from "../../../helpers/LevelAndEffmuValidate";
import { UserRulesModel } from "../../../store/User";
import { RULES_TYPES_TO_FIELDS } from "../../Admin.RulesSection/constants";
import { SCORES_TYPES_TO_FIELDS } from "../constants";
import { b } from "../index";

type ScoresSectionScoresProps = {
  color: string;
  level: string;
  network: string;
  status: string;
  KO: string;
  rulesForUser: UserRulesModel;
};

type Field = {
  type: string;
  placeholder: string;
  options: string[];
};

const getPath = (obj: rulesModel | scoresModel) => {
  const [effmu, level] = getLvlAndEffmu(obj.level);

  return {
    Format: obj.KO,
    Speed: obj.status,
    Color: obj.color,
    Level: level === "-1" ? "all" : level,
    Effmu: effmu,
    Network: obj.network,
  };
};

export const UserSectionUser = (props: ScoresSectionScoresProps) => {
  const { rulesForUser } = props;

  const { color, level, network, status, KO } = props;
  const uniqueElemKeyGetter = getUniqueElemKeyGetter(
    color + level + network + status + KO
  );
  const hasRules = rulesForUser.rules.some(
    (e) =>
      e
        .filter((item) => item.KO === KO || KO === "all")
        .filter((item) => item.status === status || status === "all")
        .filter((item) => {
          return LevelAndEffmuValidate(level, item.level);
        })
        .filter((item) => item.color === color || !color)
        .filter((item) => item.network === network || !network).length > 0
  );
  const hasScores = rulesForUser.scores.some(
    (e) =>
      e
        .filter((item) => item.KO === KO || KO === "all")
        .filter((item) => item.status === status || status === "all")
        .filter((item) => {
          return LevelAndEffmuValidate(level, item.level);
        })
        .filter((item) => item.color === color || !color)
        .filter((item) => item.network === network || !network).length > 0
  );

  return (
    <div className={b("rules")}>
      {hasRules ? (
        <div style={{ display: "flex", gap: 10 }}>
          <span
            style={{ borderRight: `"2px solid blue`, paddingRight: 10 }}
            className={b("title")}
          >
            Native Rules:
          </span>
        </div>
      ) : (
        "Native Rules: Nothing found"
      )}
      {rulesForUser.rules.map((scoreRows, scoreIndex) => {
        const isComposite = scoreRows.length > 1;

        const uniqueRuleKeyGetter = uniqueElemKeyGetter("rule" + scoreIndex);

        const rows = scoreRows
          .filter((item) => item.KO === KO || KO === "all")
          .filter((item) => item.status === status || status === "all")
          .filter((item) => {
            return LevelAndEffmuValidate(level, item.level);
          })
          .filter((item) => item.color === color || !color)
          .filter((item) => item.network === network || !network)
          .filter((item) => item.type !== "UserName");
        return (
          <div
            className={b("rule", { composite: isComposite })}
            key={uniqueRuleKeyGetter.key}
          >
            <div className={b("rule-stripe")} />
            {rows.map((scoreRow, rowIndex) => {
              const { type: ruleType, values: ruleValues } = scoreRow;
              const fields = RULES_TYPES_TO_FIELDS[ruleType] as Field[];

              const uniqueRowKeyGetter = uniqueRuleKeyGetter(
                "row" + ruleType + rowIndex
              );

              return (
                <div key={uniqueRowKeyGetter.key}>
                  <div
                    style={{ display: "flex", gap: "10px" }}
                    className={b("rule-row")}
                  >
                    {fields.map((_, fieldIndex) => {
                      const value = String(ruleValues?.[fieldIndex] || "");

                      return (
                        <span
                          style={{ color: "black", fontWeight: 400 }}
                          className={b("subtitle")}
                          key={
                            uniqueRowKeyGetter.key + value + String(fieldIndex)
                          }
                        >
                          <span style={{ fontWeight: 600 }}>{ruleType}</span> -{" "}
                          {value}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {rows.length > 0 && (
              <span
                style={{ color: "black", fontWeight: 400 }}
                className={b("subtitle")}
              >
                <span style={{ fontWeight: 600 }}>Path</span> -{" "}
                {Object.keys(getPath(scoreRows[0]))
                  .map((key) => {
                    //@ts-ignore
                    return `${key}: ${
                      //@ts-ignore
                      key === "color" && !getPath(scoreRows[0])[key]
                        ? "all"
                        : //@ts-ignore
                          getPath(scoreRows[0])[key]
                    }`;
                  })
                  .join(" | ")}
              </span>
            )}
          </div>
        );
      })}
      <br />
      {hasScores ? (
        <div style={{ display: "flex", gap: 10 }}>
          <span
            style={{ borderRight: `"2px solid blue`, paddingRight: 10 }}
            className={b("title")}
          >
            Score Rules:
          </span>
        </div>
      ) : (
        "Score Rules: Nothing found"
      )}
      {rulesForUser.scores.map((scoreRows, scoreIndex) => {
        const isComposite = scoreRows.length > 1;

        const uniqueRuleKeyGetter = uniqueElemKeyGetter("rule" + scoreIndex);

        const rows = scoreRows
          .filter((item) => item.KO === KO || KO === "all")
          .filter((item) => item.status === status || status === "all")
          .filter((item) => LevelAndEffmuValidate(level, item.level))
          .filter((item) => item.color === color || !color)
          .filter((item) => item.network === network || !network)
          .filter((item) => item.type !== "UserName");
        return (
          <div
            className={b("rule", { composite: isComposite })}
            key={uniqueRuleKeyGetter.key}
          >
            <div className={b("rule-stripe")} />

            {rows.map((scoreRow, rowIndex) => {
              const { type: ruleType, values: ruleValues } = scoreRow;
              const fields = SCORES_TYPES_TO_FIELDS[ruleType] as Field[];

              const uniqueRowKeyGetter = uniqueRuleKeyGetter(
                "row" + ruleType + rowIndex
              );

              return (
                <div key={uniqueRowKeyGetter.key}>
                  <div
                    style={{ display: "flex", gap: "10px" }}
                    className={b("rule-row")}
                  >
                    {fields.map((_, fieldIndex) => {
                      const value = String(ruleValues?.[fieldIndex] || "");

                      return (
                        <span
                          style={{ fontWeight: 400, color: "black" }}
                          className={b("subtitle")}
                          key={
                            uniqueRowKeyGetter.key +
                            value +
                            String(fieldIndex) +
                            "span2"
                          }
                        >
                          <span style={{ fontWeight: 600 }}>{ruleType}</span> -{" "}
                          {value}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {rows.length > 0 && (
              <span
                style={{ color: "black", fontWeight: 400 }}
                className={b("subtitle")}
              >
                <span style={{ fontWeight: 600 }}>Path</span> -{" "}
                {Object.keys(getPath(scoreRows[0]))
                  .map((key) => {
                    //@ts-ignore
                    return `${key}: ${
                      //@ts-ignore
                      key === "color" && !getPath(scoreRows[0])[key]
                        ? "all"
                        : //@ts-ignore
                          getPath(scoreRows[0])[key]
                    }`;
                  })
                  .join(" | ")}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
