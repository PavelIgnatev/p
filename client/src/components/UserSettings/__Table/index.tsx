import b_ from "b_";
import { FC, useMemo } from "react";
import Select from "react-select";

import { Effmu, Networks } from "../../../@types/common";
import { SelectOption } from "../../../@types/selectsModel";
import {
  EFFMU,
  EFFMUOPTIONSWITHOUTSUPERA,
  LEVELS_ARRAY,
} from "../../../constants";
import { editableConfigEvents } from "../../../store/Config";

import { specialSelectStyles } from "../../BaseSelect";

const selectStyles = {
  ...specialSelectStyles,
  option: (provided: object, state: any) => ({
    ...specialSelectStyles.option(provided, state),
    fontSize: "20px",
  }),
  control: (provided: object, state: any) => ({
    ...specialSelectStyles.control(provided, state),
    fontSize: "20px",
    width: "110px",
  }),
  noOptionsMessage: (provided: object) => ({
    display: "none",
  }),
};

interface Props {
  networks: { [key in "ko" | "freezout"]: Networks };
  canChangeLevels?: boolean;
}

const b = b_.with("user-settings-table");

function combineArraysByAlternateElements(arrays: any) {
  const result = [];
  const maxLength = Math.max(...arrays.map((arr: any) => arr.length));

  for (let i = 0; i < maxLength; i++) {
    for (let j = 0; j < arrays.length; j++) {
      if (arrays[j][i] !== undefined) {
        result.push(arrays[j][i]);
      }
    }
  }

  return result;
}

const levelsOptions: SelectOption<number | string>[] = LEVELS_ARRAY.map(
  (level) => ({
    value: level,
    label: level,
  })
);

const effmuOptions: SelectOption<Effmu>[] = EFFMU.map((effmu) => ({
  value: effmu,
  label: effmu,
}));

const effmuOptionsWithoutSuperA: SelectOption<Effmu>[] =
  EFFMUOPTIONSWITHOUTSUPERA.map((effmu) => ({
    value: effmu,
    label: effmu,
  }));

export const UserSettingsTable: FC<Props> = ({ networks, canChangeLevels }) => {
  const renderContent = useMemo(
    () =>
      (Object.keys(networks) as Array<"ko" | "freezout">).map((type) => {
        return Object.keys(networks[type]).map((network) => {
          const { level, effmu } = networks[type][network];

          const defaultOption = levelsOptions.find(
            (option) => option.value === level
          );
          const defaultEffmuOption = effmuOptions.find(
            (option) => option.value === effmu
          );

          const handleLevelChange = (option: SelectOption<number>) =>
            editableConfigEvents.handleChangeLevel({
              network,
              level: option.value,
              type,
            });
          const handleEffmuChange = (option: SelectOption<Effmu>) =>
            editableConfigEvents.handleChangeEffmu({
              network,
              effmu: option.value,
              type,
            });

          return [
            <div className={b("row")} key={type + network}>
              <div className={b("cell")}>{network}</div>

              <div
                className={b("cell")}
                style={{ padding: "6px 0", borderRight: 0 }}
              >
                {type}
              </div>

              <div
                className={b("cell")}
                style={{ padding: "6px 0", borderRight: 0 }}
              >
                {canChangeLevels ? (
                  <Select
                    defaultValue={defaultOption}
                    options={levelsOptions}
                    // @ts-ignore все работает
                    onChange={handleLevelChange}
                    className={b("input", { select: true })}
                    styles={selectStyles}
                  />
                ) : (
                  networks[type][network].level
                )}
              </div>
              <div className={b("cell")} style={{ padding: "10px 0" }}>
                <Select
                  options={
                    effmu === "SuperA" || level === 15
                      ? effmuOptions
                      : effmuOptionsWithoutSuperA
                  }
                  value={defaultEffmuOption}
                  // @ts-ignore все работает
                  onChange={handleEffmuChange}
                  className={b("input", { select: true })}
                  styles={selectStyles}
                />
              </div>
            </div>,
          ];
        });
      }),
    [canChangeLevels, networks]
  );

  return (
    <div className={b({ "select-in-cells": canChangeLevels })}>
      <div className={b("row", { headline: true })}>
        <div className={b("cell")} style={{ fontWeight: 700 }}>
          Network
        </div>
        <div className={b("cell")} style={{ fontWeight: 700 }}>
          Type
        </div>
        <div className={b("cell")} style={{ fontWeight: 700 }}>
          Level
        </div>
        <div className={b("cell")} style={{ fontWeight: 700 }}>
          Eff mu
        </div>
      </div>
      {combineArraysByAlternateElements(renderContent)}
      <div className={b("row")}>
        <div className={b("cell")} style={{ padding: 0 }} />
        <div className={b("cell")} style={{ padding: 0 }} />
        <div className={b("cell")} style={{ padding: 0 }} />
        <div className={b("cell")} style={{ padding: 0 }} />
      </div>
    </div>
  );
};
