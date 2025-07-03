import { useEffect, useState } from "react";
import Select from "react-select";
import TimeField from "react-simple-timefield";
import { Popconfirm } from "antd";

import { useStore } from "effector-react";
import { rulesModel, rulesType } from "../../../@types/rulesModel";
import { getUniqueElemKeyGetter } from "../../../helpers/getUniqueElemKeyGetter";
import {
  $rules,
  deleteRulesRequest,
  patchRulesRequest,
  postRulesRequest,
} from "../../../store/Rules";
import { validateNumber } from "../../../helpers/validateNumber";

import { specialSelectStyles } from "../../BaseSelect";
import { BaseInputString } from "../../BaseInputString";
import { BaseButton } from "../../BaseButton";

import { RULES_TYPES_TO_FIELDS, RULES_TYPES } from "../constants";
import { b } from "../index";
import { $allAliases, getAliasesRequest } from "../../../store/Alias";

type RulesSectionRulesProps = {
  color: string;
  level: string;
  network: string;
  status: string;
  KO: string;
  offpeak: boolean;
};
type valuesType = Array<Record<string, number | string | rulesType[]>>;

type Field = {
  type: string;
  placeholder: string;
  options: string[];
};

export const RulesSectionRules = (props: RulesSectionRulesProps) => {
  const savedRules = useStore($rules) as Array<rulesModel[]>;
  const postPending = useStore(postRulesRequest.pending);
  const patchPending = useStore(patchRulesRequest.pending);
  const deletePending = useStore(deleteRulesRequest.pending);
  const aliases = useStore($allAliases);
  const pending = postPending || patchPending || deletePending;

  const [types, setTypes] = useState<rulesType[]>([RULES_TYPES[0]]);
  const [values, setValues] = useState<valuesType>([{}]);

  useEffect(() => {
    getAliasesRequest();
  }, []);

  const handleAddRuleRow = () => {
    setTypes((types) => [...types, RULES_TYPES[0]]);
    setValues((values) => [...values, {}]);
  };

  const handleRemoveRuleRow = (
    ruleIndex: number,
    exceptionIndex = 0,
    isExceptions = false
  ) => {
    if (isExceptions) {
      setValues((values) => {
        const newValues = [...values];
        const { exceptions } = newValues[ruleIndex];

        if (exceptions && Array.isArray(exceptions)) {
          exceptions.splice(exceptionIndex, 1);
        }

        return newValues;
      });
    } else {
      setTypes((types) => {
        const newTypes = [...types];
        newTypes.splice(ruleIndex, 1);
        return newTypes;
      });
      setValues((values) => {
        const newValues = [...values];
        newValues.splice(ruleIndex, 1);
        return newValues;
      });
    }
  };

  const editableRule = types.map((type, ruleIndex) => ({
    type,
    values: new Array(RULES_TYPES_TO_FIELDS[type].length)
      .fill(null)
      .map((_, i) => {
        const data = values?.[ruleIndex]?.[i];
        if (Array.isArray(data)) {
          return;
        }

        return data ?? "";
      }),
    exceptions: values?.[ruleIndex]?.exceptions,
    ...props,
  })) as any;

  const rules: rulesModel[][] = [editableRule, ...savedRules];

  const handleSaveRule = () => {
    postRulesRequest(editableRule);
    setValues([{}]);
  };

  const handleTypeChange = (rowIndex: number) => (e: any) => {
    setTypes((types) => {
      const newTypes = [...types];
      newTypes[rowIndex] = e?.value ?? RULES_TYPES[0];
      return newTypes;
    });
    setValues((values) => {
      const newValues = [...values];
      newValues[rowIndex] = {};
      return newValues;
    });
  };

  const handleValues = (
    value: string | number | any,
    rowIndex: number,
    fieldIndex: number | string
  ) => {
    setValues((values) => {
      const newValues = [...values];

      if (!newValues[rowIndex]) {
        newValues[rowIndex] = {};
      }
      if (Array.isArray(value)) {
        if (!newValues[rowIndex][fieldIndex]) {
          newValues[rowIndex][fieldIndex] = [];
        }
        //@ts-ignore
        newValues[rowIndex][fieldIndex].push(value);
      } else {
        newValues[rowIndex][fieldIndex] = value;
      }

      return newValues;
    });
  };

  const handleExceptionsValue = (
    value: string | number | any,
    rowIndex: number,
    fieldIndex: number | string,
    exceptionIndex: number,
    exceptionIndex2: number
  ) => {
    setValues((values) => {
      const newValues = [...values];

      if (!newValues[rowIndex]) {
        newValues[rowIndex] = {};
      }

      // @ts-ignore
      newValues[rowIndex].exceptions[exceptionIndex2][exceptionIndex].values[
        fieldIndex
      ] = value;

      return newValues;
    });
  };

  const { color, level, network, status, KO } = props;
  const uniqueElemKeyGetter = getUniqueElemKeyGetter(
    color + level + network + status + KO
  );

  return (
    <div className={b("rules")}>
      {rules.map((ruleRows, ruleIndex) => {
        const isComposite = ruleRows.length > 1;
        const isEditable = ruleIndex === 0;
        const offpeak = ruleRows?.[0]?.offpeak ?? false;

        const isSaveBtnDisabled = getIsSaveBtnDisabled(ruleRows, values);

        const uniqueRuleKeyGetter = uniqueElemKeyGetter("rule" + ruleIndex);

        return (
          <div
            className={b("rule", { composite: isComposite })}
            key={uniqueRuleKeyGetter.key}
          >
            <div className={b("rule-stripe")} />
            {ruleRows.map((ruleRow, rowIndex) => {
              const {
                type: ruleType,
                values: ruleValues,
                exceptions,
              } = ruleRow;

              const fields = RULES_TYPES_TO_FIELDS[ruleType] as Field[];
              const isOffpeak =
                fields.findIndex((rule) => rule.placeholder === "Guarantee") !==
                -1;
              const isLastRow = rowIndex === ruleRows.length - 1;

              const uniqueRowKeyGetter = uniqueRuleKeyGetter(
                "row" + ruleType + rowIndex
              );

              return (
                <div
                  className={b("rule-row")}
                  key={uniqueRowKeyGetter.key}
                  style={{ flexDirection: "column" }}
                >
                  <div style={{ display: "flex", minHeight: "48px" }}>
                    <Select
                      styles={specialSelectStyles}
                      options={RULES_TYPES?.map((type) => ({
                        value: type,
                        label: type,
                      }))}
                      onChange={handleTypeChange(rowIndex)}
                      className={b("rule-row-select")}
                      isDisabled={!isEditable || pending}
                      defaultValue={{ value: ruleType, label: ruleType }}
                      key={String(Math.random()).substr(2, 12)}
                    />
                    {fields.map((field, fieldIndex) => {
                      const { type: elementType, placeholder, options } = field;

                      const isNum = elementType === "number";
                      const value = String(ruleValues?.[fieldIndex] || "");
                      const isTime = elementType === "time";
                      const isUserName = elementType === "UserName";

                      const uniqueFieldKeyGetter = uniqueRowKeyGetter(
                        "field" + fieldIndex
                      );

                      if (field.options?.length) {
                        return (
                          <Select
                            className={b("rule-row-field", { select: true })}
                            styles={specialSelectStyles}
                            placeholder={placeholder}
                            defaultValue={
                              value ? { value, label: value } : null
                            }
                            options={options?.map((option) => ({
                              value: option,
                              label: option,
                            }))}
                            onChange={(e) => {
                              const value = e?.value || "";

                              handleValues(value, rowIndex, fieldIndex);
                            }}
                            isDisabled={!isEditable || pending}
                            key={String(Math.random()).substr(2, 12)}
                          />
                        );
                      }

                      if (isTime) {
                        return (
                          <TimeField
                            key={String(
                              uniqueRowKeyGetter("time" + fieldIndex)
                            )}
                            value={value}
                            onChange={(e, value) => {
                              handleValues(String(value), rowIndex, fieldIndex);
                            }}
                            // @ts-ignore
                            disabled={!isEditable || pending}
                            style={{
                              marginLeft: "20px",
                              backgroundColor:
                                isEditable && !pending
                                  ? "#f5f8ff"
                                  : "rgb(242, 242, 242)",
                              borderRadius: "10px",
                              color: `${
                                isEditable && !pending
                                  ? "black"
                                  : "rgb(132, 132, 132)"
                              }`,
                              fontSize: "20px",
                              padding: "0 10px",
                              minWidth: "200px",
                              border: "none",
                              outline: "none",
                              boxShadow:
                                "0 0 1px 1px rgba(0, 0, 0, 0.02), 0 0.1px 0.3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.2)",
                            }}
                          />
                        );
                      }

                      if (isUserName) {
                        return (
                          <Select
                            className={b("rule-row-field", { select: true })}
                            styles={specialSelectStyles}
                            placeholder={"UserName"}
                            defaultValue={
                              value ? { value, label: value } : null
                            }
                            options={aliases.map((option) => ({
                              value: option,
                              label: option,
                            }))}
                            onChange={(e) => {
                              const value = e?.value || "";

                              handleValues(value, rowIndex, fieldIndex);
                            }}
                            isDisabled={!isEditable || pending}
                            key={String(Math.random()).substr(2, 12)}
                          />
                        );
                      }

                      return (
                        <BaseInputString
                          className={b("rule-row-field", { input: true })}
                          value={value}
                          onChange={(value) => {
                            handleValues(
                              isNum ? validateNumber(value) : value,
                              rowIndex,
                              fieldIndex
                            );
                          }}
                          placeholder={placeholder}
                          disabled={!isEditable || pending}
                          key={uniqueFieldKeyGetter("input").key}
                        />
                      );
                    })}
                    {!isEditable && (
                      <div
                        className={b("rule-stripe")}
                        style={{ right: "-12px", left: "initial" }}
                      />
                    )}
                    {isEditable &&
                      rules[ruleIndex][rowIndex].type !== "UserName" && (
                        <BaseButton
                          className={b("rule-row-control-btn")}
                          onClick={() => {
                            const data = { ...rules[ruleIndex][rowIndex] };
                            if (data["exceptions"]) {
                              data["exceptions"] = undefined;
                            }
                            handleValues(
                              [
                                { ...data, values: [] },
                                {
                                  ...data,
                                  type: "UserName",
                                  values: [],
                                },
                              ],
                              rowIndex,
                              "exceptions"
                            );
                          }}
                          disabled={pending}
                          orange
                        >
                          Add exception
                        </BaseButton>
                      )}
                    {isEditable && (
                      <BaseButton
                        className={b("rule-row-control-btn")}
                        onClick={() => handleRemoveRuleRow(rowIndex)}
                        disabled={pending}
                      >
                        Х
                      </BaseButton>
                    )}

                    {!isEditable && isLastRow && isOffpeak && (
                      <BaseButton
                        onClick={() => {
                          patchRulesRequest({
                            rule: ruleRows,
                            offpeak: !offpeak,
                          });
                        }}
                        green={offpeak}

                        disabled={pending}
                        className={b("rule-row-control-btn", {
                          offpeak: true,
                          delete: true
                        })}
                      >
                        Offpeak
                      </BaseButton>
                    )}

                    {!isEditable && isLastRow && (
                                              <Popconfirm
                          placement="topRight"
                          title="Are you sure you want to remove this tournament? This action will remove the tournament from the rules, but will move the data to the edit functionality"
                          okText="Yes"
                          cancelText="No"
                        onConfirm={() =>
                          deleteRulesRequest(rules[ruleIndex]).then(() => {
                            setTypes(rules[ruleIndex].map((e) => e.type));

                            setValues(
                              rules[ruleIndex].map(({ values, exceptions }) => {
                                const result: any = {};
                                values.forEach((v, index) => {
                                  result[index] = v;
                                });

                                if (exceptions) {
                                  result["exceptions"] = exceptions;
                                }

                                return result;
                              })
                            );
                          })
                        }
                      >
                        <BaseButton
                          className={b("rule-row-control-btn", {
                            change: true,
                            delete: true
                          })}
                          disabled={pending}
                          onClick={() => {}}
                          purple
                        >
                          Change
                        </BaseButton>
                      </Popconfirm>
                    )}
                    {!isEditable && isLastRow && (
                      <Popconfirm
                        placement="topRight"
                        title="Really delete the tournament? This action will remove the tournament from the rules"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => deleteRulesRequest(rules[ruleIndex])}
                      >
                        <BaseButton
                          className={b("rule-row-control-btn", {
                            delete: true,
                          })}
                          onClick={() => {}}
                          disabled={pending}
                          red
                        >
                          Delete rule
                        </BaseButton>
                      </Popconfirm>
                    )}
                  </div>
                  {exceptions?.map((exception, indexExc2) => {
                    return (
                      <div
                        className={b("huypizda")}
                        style={{ display: "flex" }}
                        key={`groups${indexExc2}`}
                      >
                        <div>
                          {exception.map((exc, indexExc) => {
                            const { type: ruleType, values: ruleValues } = exc;
                            const fields = RULES_TYPES_TO_FIELDS[
                              ruleType
                            ] as Field[];

                            const uniqueRowKeyGetter = uniqueRuleKeyGetter(
                              "row" + ruleType + rowIndex + indexExc2 + indexExc
                            );

                            return (
                              <div
                                style={{
                                  display: "flex",
                                  marginLeft: "16px",
                                  minHeight: "48px",
                                }}
                                className={b("wrp")}
                                key={`group${indexExc}${indexExc2}`}
                              >
                                <div className={b("rule-stripe-red")} />
                                <Select
                                  styles={specialSelectStyles}
                                  className={b("rule-row-select")}
                                  isDisabled
                                  defaultValue={{
                                    value: ruleType,
                                    label: ruleType,
                                  }}
                                  key={String(Math.random()).substr(2, 12)}
                                />

                                {fields.map((field, fieldIndex) => {
                                  const {
                                    type: elementType,
                                    placeholder,
                                    options,
                                  } = field;

                                  const isNum = elementType === "number";
                                  const value = String(
                                    ruleValues?.[fieldIndex] || ""
                                  );
                                  const isTime = elementType === "time";
                                  const isUserName = elementType === "UserName";

                                  const uniqueFieldKeyGetter =
                                    uniqueRowKeyGetter("field" + fieldIndex);

                                  if (field.options?.length) {
                                    return (
                                      <Select
                                        className={b("rule-row-field", {
                                          select: true,
                                        })}
                                        styles={specialSelectStyles}
                                        placeholder={placeholder}
                                        defaultValue={
                                          value ? { value, label: value } : null
                                        }
                                        options={options?.map((option) => ({
                                          value: option,
                                          label: option,
                                        }))}
                                        onChange={(e) => {
                                          const value = e?.value || "";

                                          handleExceptionsValue(
                                            value,
                                            rowIndex,
                                            fieldIndex,
                                            indexExc,
                                            indexExc2
                                          );
                                        }}
                                        isDisabled={!isEditable || pending}
                                        key={String(Math.random()).substr(
                                          2,
                                          12
                                        )}
                                      />
                                    );
                                  }

                                  if (isTime) {
                                    return (
                                      <TimeField
                                        key={String(
                                          uniqueRowKeyGetter(
                                            "time" + fieldIndex
                                          )
                                        )}
                                        value={value}
                                        onChange={(e, value) => {
                                          handleExceptionsValue(
                                            String(value),
                                            rowIndex,
                                            fieldIndex,
                                            indexExc,
                                            indexExc2
                                          );
                                        }}
                                        // @ts-ignore
                                        disabled={!isEditable || pending}
                                        style={{
                                          marginLeft: "20px",
                                          backgroundColor:
                                            isEditable && !pending
                                              ? "#f5f8ff"
                                              : "rgb(242, 242, 242)",
                                          borderRadius: "10px",
                                          color: `${
                                            isEditable && !pending
                                              ? "black"
                                              : "rgb(132, 132, 132)"
                                          }`,
                                          fontSize: "20px",
                                          padding: "0 10px",
                                          minWidth: "200px",
                                          border: "none",
                                          outline: "none",
                                          boxShadow:
                                            "0 0 1px 1px rgba(0, 0, 0, 0.02), 0 0.1px 0.3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.2)",
                                        }}
                                      />
                                    );
                                  }

                                  if (isUserName) {
                                    return (
                                      <Select
                                        className={b("rule-row-field", {
                                          select: true,
                                        })}
                                        styles={specialSelectStyles}
                                        placeholder={"UserName"}
                                        defaultValue={
                                          value ? { value, label: value } : null
                                        }
                                        options={aliases.map((option) => ({
                                          value: option,
                                          label: option,
                                        }))}
                                        onChange={(e) => {
                                          const value = e?.value || "";

                                          handleExceptionsValue(
                                            value,
                                            rowIndex,
                                            fieldIndex,
                                            indexExc,
                                            indexExc2
                                          );
                                        }}
                                        isDisabled={!isEditable || pending}
                                        key={String(Math.random()).substr(
                                          2,
                                          12
                                        )}
                                      />
                                    );
                                  }

                                  return (
                                    <BaseInputString
                                      className={b("rule-row-field", {
                                        input: true,
                                      })}
                                      value={value}
                                      onChange={(value) => {
                                        handleExceptionsValue(
                                          isNum ? validateNumber(value) : value,
                                          rowIndex,
                                          fieldIndex,
                                          indexExc,
                                          indexExc2
                                        );
                                      }}
                                      placeholder={placeholder}
                                      disabled={!isEditable || pending}
                                      key={uniqueFieldKeyGetter("input").key}
                                    />
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>

                        {isEditable && (
                          <BaseButton
                            className={b("rule-row-control-btn")}
                            onClick={() =>
                              handleRemoveRuleRow(rowIndex, indexExc2, true)
                            }
                            disabled={pending}
                            style={{ height: "48px" }}
                          >
                            Х
                          </BaseButton>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {isEditable && (
              <div className={b("rule-row")}>
                <BaseButton
                  onClick={handleAddRuleRow}
                  className={b("rule-row-control-btn")}
                  disabled={pending}
                >
                  Add rule row
                </BaseButton>
                <BaseButton
                  onClick={handleSaveRule}
                  className={b("rule-row-control-btn")}
                  green
                  disabled={isSaveBtnDisabled || pending}
                >
                  Save rule
                </BaseButton>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const getIsSaveBtnDisabled = (ruleRows: rulesModel[], values: valuesType) => {
  for (let rowKey = 0; rowKey < ruleRows.length; rowKey += 1) {
    if (!values[rowKey]) {
      return true;
    }
    const fieldKeysCount = RULES_TYPES_TO_FIELDS[ruleRows[rowKey].type].length;

    for (let fieldKey = 0; fieldKey < fieldKeysCount; fieldKey += 1) {
      if (!values[rowKey][fieldKey]) {
        return true;
      }
      if (values[rowKey].exceptions) {
        for (
          let dd = 0;
          dd < Object.keys(values[rowKey].exceptions).length;
          dd++
        ) {
          for (
            let rr = 0;
            // @ts-ignore
            rr < Object.keys(values[rowKey].exceptions[dd]).length;
            rr++
          ) {
            const fieldKeysCount =
              // @ts-ignore
              RULES_TYPES_TO_FIELDS[values[rowKey].exceptions[dd][rr].type]
                .length;

            for (
              let fieldKey2 = 0;
              fieldKey2 < fieldKeysCount;
              fieldKey2 += 1
            ) {
              if (
                // @ts-ignore
                !values?.[rowKey]?.exceptions?.[dd]?.[rr]?.values?.[fieldKey2]
              ) {
                return true;
              }
            }
          }
        }
      }
    }
  }

  return ruleRows.length === 0;
};
