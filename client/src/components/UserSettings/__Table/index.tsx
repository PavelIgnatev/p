import b_ from "b_";
import { FC, useMemo } from "react";
import { Select } from "antd";

import { Effmu, Networks } from "../../../@types/common";
import { SelectOption } from "../../../@types/selectsModel";
import {
  EFFMU,
  EFFMUOPTIONSWITHOUTSUPERA,
  LEVELS_ARRAY,
} from "../../../constants";
import { editableConfigEvents } from "../../../store/Config";

import "./index.scss";

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

const levelsOptions = LEVELS_ARRAY.map((level) => ({
  value: level,
  label: level,
}));

const effmuOptions = EFFMU.map((effmu) => ({
  value: effmu,
  label: effmu,
}));

const effmuOptionsWithoutSuperA = EFFMUOPTIONSWITHOUTSUPERA.map((effmu) => ({
  value: effmu,
  label: effmu,
}));

export const UserSettingsTable: FC<Props> = ({ networks, canChangeLevels }) => {
  const renderContent = useMemo(
    () =>
      (Object.keys(networks) as Array<"ko" | "freezout">).map((type) => {
        return Object.keys(networks[type]).map((network) => {
          const { level, effmu } = networks[type][network];

          const handleLevelChange = (value: number | string) =>
            editableConfigEvents.handleChangeLevel({
              network,
              level: value,
              type,
            });
          const handleEffmuChange = (value: Effmu) =>
            editableConfigEvents.handleChangeEffmu({
              network,
              effmu: value,
              type,
            });

          return [
            <div className={b("row")} key={type + network}>
              <div className={b("cell")}>{network}</div>
              <div className={b("cell")}>{type}</div>
              <div className={b("cell")}>
                {canChangeLevels ? (
                  <Select
                    value={level}
                    options={levelsOptions}
                    onChange={handleLevelChange}
                    className={b("input", { select: true })}
                  />
                ) : (
                  networks[type][network].level
                )}
              </div>
              <div className={b("cell")}>
                <Select
                  options={
                    effmu === "SuperA" || level === 15
                      ? effmuOptions
                      : effmuOptionsWithoutSuperA
                  }
                  value={effmu}
                  onChange={handleEffmuChange}
                  className={b("input", { select: true })}
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
        <div className={b("cell")}>Network</div>
        <div className={b("cell")}>Type</div>
        <div className={b("cell")}>Level</div>
        <div className={b("cell")}>Eff mu</div>
      </div>
      {combineArraysByAlternateElements(renderContent)}
    </div>
  );
};
