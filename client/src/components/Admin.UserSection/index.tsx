import b_ from "b_";
import { useEffect, useState } from "react";
import Select from "react-select";

import { Effmu } from "../../@types/common";
import { SelectOption } from "../../@types/selectsModel";
import { EFFMU } from "../../constants";
import { SHORT_NETWORKS_FOR_USER } from "../../store/Select";

import { specialSelectStyles } from "../BaseSelect";
import { ColorPalette } from "../ColorPalette";
import { ElementsToggle, useElementsToggle } from "../ElementsToggle";
import { LevelBlocks, useLevelBlocks } from "../LevelBlocks";
import { UserSectionUser } from "./__User";

import "./index.scss";
import { useStore } from "effector-react";
import { $allAliases, getAllAliasesRequest } from "../../store/Alias";
import classNames from "classnames";
import { $rulesForUser, getRulesForUser } from "../../store/User";

type KOType = "KO" | "Freezout" | "all";
type StatusType = "Normal" | "Turbo" | "SuperTurbo" | "all";
type ColorsType = "" | "blue" | "red" | "brown" | "black" | "green" | "orange";
const KO: KOType[] = ["KO", "Freezout", "all"];
const Status: StatusType[] = ["Normal", "Turbo", "SuperTurbo", "all"];
const Colors: ColorsType[] = [
  "",
  "blue",
  "red",
  "brown",
  "black",
  "green",
  "orange",
];

export const b = b_.with("rules-section");

export const UserSection = () => {
  const { selectedLevel, handleLevelChange } = useLevelBlocks();
  const aliases = useStore($allAliases);
  const [userName, setUserName] = useState(null);
  const rulesForUser = useStore($rulesForUser);

  useEffect(() => {
    getAllAliasesRequest();
  }, []);

  useEffect(() => {
    getRulesForUser(userName || null);
  }, [userName]);

  const {
    selectedElement: selectedEffmu,
    handleElementChange: handleEffmuChange,
  } = useElementsToggle<Effmu | "all">("all");
  const { selectedElement: selectedKO, handleElementChange: handleKOChange } =
    useElementsToggle<KOType>("all");
  const {
    selectedElement: selectedStatus,
    handleElementChange: handleStatusChange,
  } = useElementsToggle<StatusType>("all");
  const {
    selectedElement: selectedColor,
    handleElementChange: handleColorChange,
  } = useElementsToggle<ColorsType>(Colors[0]);
  const [selectedNetwork, setSelectedNetwork] = useState(
    SHORT_NETWORKS_FOR_USER[0].value
  );
  const handleNetworkChange = (option: SelectOption<string>) =>
    setSelectedNetwork(option.value ?? SHORT_NETWORKS_FOR_USER[0].value);
  const level = selectedLevel + selectedEffmu;

  return (
    <>
      <section className={b()} style={{ marginBottom: "60vh" }}>
        <span className={b("title")}>Rules for UserName:</span>
        <Select
          style={{ margin: 0 }}
          className={classNames(
            b("rule-row-field", { select: true }),
            b("otstup")
          )}
          styles={specialSelectStyles}
          placeholder={"UserName"}
          defaultValue={userName ? { value: userName, label: userName } : null}
          //@ts-ignore
          options={aliases.map((option) => ({
            value: option,
            label: option,
          }))}
          onChange={(e) => {
            if (e?.value === userName) {
              setUserName(null);
            } else {
              setUserName(e?.value || null);
            }
          }}
          isDisabled={false}
          key={String(Math.random()).substr(2, 12)}
        />
        {rulesForUser && (
          <LevelBlocks
            selectedLevel={selectedLevel}
            onLevelChange={handleLevelChange}
            withAllLevels
          />
        )}
        {selectedLevel !== null && rulesForUser && (
          <>
            <div className={b("filter")}>
              <ElementsToggle
                mix={b("elems-toggle", { effmu: true })}
                selectedElement={selectedEffmu}
                onElementChange={handleEffmuChange}
                elements={EFFMU.concat(["all"])}
              />
              <Select
                styles={specialSelectStyles}
                placeholder="Network"
                options={SHORT_NETWORKS_FOR_USER}
                // @ts-ignore
                onChange={handleNetworkChange}
                className={b("filter-network")}
                defaultValue={SHORT_NETWORKS_FOR_USER[0]}
              />
              <ColorPalette
                selectedElement={selectedColor}
                onElementChange={handleColorChange}
                elements={Colors}
              />
            </div>
            <div className={b("filter")}>
              <ElementsToggle
                mix={b("elems-toggle", { KO: true })}
                selectedElement={selectedKO}
                onElementChange={handleKOChange}
                elements={KO}
              />
              <div className={b("elems-toggle-divider")} />
              <ElementsToggle
                mix={b("elems-toggle", { status: true })}
                selectedElement={selectedStatus}
                onElementChange={handleStatusChange}
                elements={Status}
              />
            </div>
            <UserSectionUser
              rulesForUser={rulesForUser}
              color={selectedColor}
              level={level}
              network={selectedNetwork}
              status={selectedStatus}
              KO={selectedKO}
            />
          </>
        )}
      </section>
    </>
  );
};
