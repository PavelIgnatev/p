import React, { FC, useEffect } from "react";
import cx from "classnames";
import { Drawer } from "antd";
import {
  $tournamentsSettings,
  editableTournamentsSettings,
  NETWORKS,
  TIMERANGE,
} from "../../store/Select";
import { useStore } from "effector-react";
import { BaseSelect } from "../BaseSelect/BaseSelect";
import { BaseSelectMulti } from "../BaseSelectMulti/BaseSelectMulti";
import { BaseInput } from "../BaseInput/BaseInput";
import { BaseCheckbox } from "../BaseCheckbox";
import { BaseInputMask } from "../BaseInputMask";
import { ComponentCategory } from "../ComponentCategory";
import { BaseButton } from "../BaseButton";
import { fetchUserReposFx } from "../../store/Table";
import { $config, getConfigRequest } from "../../store/Config";
import { $theme, toggleTheme } from "../../store/Theme";
import { ErrNot } from "../NotificationService";
import profileSrc from "../../assets/icons/Profile.svg";

import classes from "./BaseHeader.module.scss";
import { UserSettings } from "../UserSettings";
import Switch from "react-switch";

export const BaseHeader: FC = () => {
  const tournamentsSettings = useStore($tournamentsSettings);
  const loading = useStore(fetchUserReposFx.pending);

  const config = useStore($config);
  const theme = useStore($theme);

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleSettingsModalOpen = async () => {
    if (config?.alias && config?.password) {
      await getConfigRequest({
        alias: config.alias,
        password: config.password,
      });
      setDrawerOpen(true);
    }
  };

  const handleGamesSearch = () => {
    const settings = tournamentsSettings;

    // Проверка network
    if (!settings.network || settings.network.length === 0) {
      ErrNot("Please select at least one network");
      return;
    }

    // Проверка time
    if (!settings.time) {
      ErrNot("Please select a time range (Starts)");
      return;
    }

    const formatLeftSelected = settings.KO || settings.freezout;
    const formatRightSelected =
      settings.normal || settings.turbo || settings.superTurbo;
    if (!formatLeftSelected || !formatRightSelected) {
      ErrNot(
        "Please select a format: at least one of KO or Freezout and at least one of Normal, Turbo or Super Turbo"
      );
      return;
    }

    // Если все проверки прошли, вызываем запрос
    fetchUserReposFx();
  };

  return (
    <>
      <header className={classes.header}>
        <div className={classes.info}>
          <div className={classes.userInfo}>
            <div className={classes.alias}>
              <img
                className={classes.profileImage}
                src={profileSrc}
                alt="profile"
              />
              <p>
                Hello, <strong>{config?.alias}!</strong>
              </p>
            </div>
            <div className={classes.dot}></div>
            <div className={classes.mail}>
              <strong>Your e-mail: </strong>
              {config?.mail}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Switch
              onChange={() => toggleTheme()}
              checked={theme === "dark"}
              onColor="#374151"
              offColor="#e5e7eb"
              onHandleColor="#ffffff"
              offHandleColor="#ffffff"
              handleDiameter={24}
              uncheckedIcon={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="black"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </div>
              }
              checkedIcon={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42" />
                  </svg>
                </div>
              }
              width={60}
              height={32}
              className={classes.themeSwitch}
            />
            <div className={classes.settings} onClick={handleSettingsModalOpen}>
              Edit settings
            </div>
          </div>
        </div>
        <div className={classes.menu}>
          <div className={classes.content}>
            <ComponentCategory category="Network">
              <BaseSelectMulti
                value={tournamentsSettings.network || null}
                className={classes.network}
                children={
                  (tournamentsSettings.network?.length ?? 0) + " networks"
                }
                options={NETWORKS}
                onChange={editableTournamentsSettings.handleChangeNetwork}
                placeholder="Network"
              />
            </ComponentCategory>
            <ComponentCategory category="Buy-in">
              <div className={classes.inputWrapper}>
                <BaseInput
                  value={tournamentsSettings.moneyStart}
                  handleChange={
                    editableTournamentsSettings.handleChangeMoneyStart
                  }
                  max={tournamentsSettings.moneyEnd ?? 0}
                  placeholder="From"
                  className={classes.input}
                />
                <BaseInput
                  value={tournamentsSettings.moneyEnd}
                  handleChange={
                    editableTournamentsSettings.handleChangeMoneyEnd
                  }
                  max={100000}
                  placeholder="To"
                  className={classes.input}
                />
              </div>
            </ComponentCategory>
            <ComponentCategory
              category="Prizepool"
              className={classes.prizepool}
            >
              <div className={classes.inputWrapper}>
                <BaseInput
                  value={tournamentsSettings.prizepoolStart}
                  handleChange={
                    editableTournamentsSettings.handleChangePrizepoolStart
                  }
                  max={tournamentsSettings.prizepoolEnd}
                  placeholder="From"
                  htmlId="prizepool-from"
                  className={classes.input}
                />
                <BaseInput
                  value={tournamentsSettings.prizepoolEnd}
                  handleChange={
                    editableTournamentsSettings.handleChangePrizepoolEnd
                  }
                  max={10000000}
                  placeholder="To"
                  htmlId="prizepool-to"
                  className={classes.input}
                />
              </div>
            </ComponentCategory>
          </div>
          <div className={classes.content}>
            <div className={classes.starts}>
              <ComponentCategory category="Starts">
                <BaseSelect
                  value={tournamentsSettings.time}
                  className={classes.time}
                  options={TIMERANGE}
                  defaultValue={TIMERANGE[1]}
                  onChange={editableTournamentsSettings.handleChangeTime}
                  placeholder="Time"
                />
              </ComponentCategory>
              <ComponentCategory>
                <div className={classes.inputWrapper}>
                  <BaseInputMask
                    placeholder="From(h)"
                    value={tournamentsSettings.dateStart}
                    handleChange={
                      editableTournamentsSettings.handleChangeDateStart
                    }
                    className={cx(classes.input, classes.inputTime)}
                  />
                  <BaseInputMask
                    placeholder="To(h)"
                    value={tournamentsSettings.dateEnd}
                    handleChange={
                      editableTournamentsSettings.handleChangeDateEnd
                    }
                    className={cx(classes.input, classes.inputTime)}
                  />
                </div>
              </ComponentCategory>
              <ComponentCategory></ComponentCategory>
            </div>
            <ComponentCategory category="Format">
              <div className={classes.checkboxWrapper}>
                <BaseCheckbox
                  selected={!tournamentsSettings.KO}
                  onClick={() =>
                    editableTournamentsSettings.handleChangeKo(
                      !tournamentsSettings.KO
                    )
                  }
                  className={classes.checkbox}
                >
                  KO
                </BaseCheckbox>
                <BaseCheckbox
                  selected={!tournamentsSettings.freezout}
                  onClick={() =>
                    editableTournamentsSettings.handleChangeFreezout(
                      !tournamentsSettings.freezout
                    )
                  }
                  className={classes.checkbox}
                >
                  Freezout
                </BaseCheckbox>
                <div className={classes.line} />
                <BaseCheckbox
                  selected={!tournamentsSettings.normal}
                  onClick={() =>
                    editableTournamentsSettings.handleChangeNormal(
                      !tournamentsSettings.normal
                    )
                  }
                  className={classes.checkbox}
                >
                  Normal
                </BaseCheckbox>
                <BaseCheckbox
                  selected={!tournamentsSettings.turbo}
                  onClick={() =>
                    editableTournamentsSettings.handleChangeTurbo(
                      !tournamentsSettings.turbo
                    )
                  }
                  className={classes.checkbox}
                >
                  Turbo
                </BaseCheckbox>
                <BaseCheckbox
                  selected={!tournamentsSettings.superTurbo}
                  onClick={() =>
                    editableTournamentsSettings.handleChangeSuperTurbo(
                      !tournamentsSettings.superTurbo
                    )
                  }
                  className={classes.checkbox}
                >
                  Super Turbo
                </BaseCheckbox>
              </div>
            </ComponentCategory>
          </div>
          <div className={classes.content}>
            <BaseButton
              disabled={loading}
              onClick={handleGamesSearch}
              className={classes.button}
            >
              Games search
            </BaseButton>
          </div>
        </div>
      </header>
      <Drawer
        title={`Settings: ${config?.alias || ""}`}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={800}
        bodyStyle={{
          padding: "32px",
        }}
        className={theme === "dark" ? "dark-theme" : ""}
      >
        {config ? (
          <UserSettings
            config={config}
            isAdminPage={false}
            onClose={() => setDrawerOpen(false)}
          />
        ) : (
          <div style={{ padding: 50 }}>Loading config</div>
        )}
      </Drawer>
    </>
  );
};
