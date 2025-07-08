import React, { FC, useEffect, useState } from "react";
import cx from "classnames";
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
import { fetchUserReposFx, $tableState } from "../../store/Table";
import { $config } from "../../store/Config";
import {
  $theme,
  toggleTheme,
  setCanToggleTheme,
  $canToggleTheme,
} from "../../store/Theme";
import { ErrNot } from "../../components/NotificationService";
import classes from "./BaseHeader.module.scss";
import Switch from "react-switch";
import { Tooltip } from "antd";
import { useIntervalWorker } from "../../hooks/useIntervalWorker";

interface BaseHeaderProps {
  onSettingsClick: () => void;
}

export const BaseHeader: FC<BaseHeaderProps> = ({ onSettingsClick }) => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const tournamentsSettings = useStore($tournamentsSettings);
  const loading = useStore(fetchUserReposFx.pending);
  const tableData = useStore($tableState);
  const config = useStore($config);
  const theme = useStore($theme);
  const canToggleTheme = useStore($canToggleTheme);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { setIntervalWorker } = useIntervalWorker();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Выкидываем из сессии каждые 12 часов
    const id = setIntervalWorker(() => {
      window.location.reload();
    }, 12 * 60 * 60 * 1000);

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [setIntervalWorker]);

  // Эффект для управления возможностью переключения темы
  useEffect(() => {
    // Запрещаем переключение если идет поиск или есть данные
    const canToggle = !loading && (!tableData || tableData.length === 0);
    setCanToggleTheme(canToggle);
  }, [loading, tableData]);

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
    setIsMenuExpanded(false); // Скрываем меню при поиске
    fetchUserReposFx();
  };

  const showEmail = config?.mail && config.mail.length >= 5;

  return (
    <header className={classes.header}>
      <div className={classes.info}>
        <div className={classes.userInfo}>
          <div
            className={classes.userProfile}
            onClick={onSettingsClick}
            style={{ cursor: "pointer" }}
          >
            <div className={classes.avatar}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgb(99, 102, 241)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className={classes.userDetails}>
              <div className={classes.userInfo}>
                <div className={classes.userName}>
                  Hello, <strong>{config?.alias || "Guest"}</strong>
                </div>

                {showEmail && (
                  <>
                    <div className={classes.dot}></div>
                    <div className={classes.userEmail}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgb(99, 102, 241)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <span style={{ marginLeft: "2px" }}>
                        {config?.mail?.toLowerCase()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
          className={classes.alls}
        >
          <Tooltip
            title={
              canToggleTheme
                ? "Toggle theme"
                : "Cannot toggle theme while searching"
            }
          >
            <div
              style={{ opacity: canToggleTheme ? 1 : 0.5 }}
              className={classes.alls2}
            >
              <Switch
                onChange={() => toggleTheme()}
                checked={theme === "dark"}
                onColor="#374151"
                offColor="#e5e7eb"
                onHandleColor="#ffffff"
                offHandleColor="#ffffff"
                handleDiameter={24}
                disabled={!canToggleTheme}
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
            </div>
          </Tooltip>
          <div
            className={cx(classes.searchSettingsButton, {
              [classes.expanded]: isMenuExpanded,
            })}
            onClick={() => setIsMenuExpanded(!isMenuExpanded)}
          >
            <span>Search settings</span>
            <div className={classes.icon}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
          <div
            className={classes.settings}
            onClick={onSettingsClick}
            style={{ cursor: "pointer" }}
          >
            Edit settings
          </div>
        </div>
      </div>
      <div
        className={cx(classes.menu, { [classes.menuExpanded]: isMenuExpanded })}
      >
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
          <ComponentCategory category="Buy-in" className={classes.buyinCategory}>
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
                handleChange={editableTournamentsSettings.handleChangeMoneyEnd}
                max={100000}
                placeholder="To"
                className={classes.input}
              />
            </div>
          </ComponentCategory>
          <ComponentCategory category="Prizepool" className={classes.prizepool}>
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
            <ComponentCategory category="Starts" className={classes.startsCategory}>
              <BaseSelect
                value={tournamentsSettings.time}
                className={classes.time}
                options={TIMERANGE}
                defaultValue={TIMERANGE[1]}
                onChange={editableTournamentsSettings.handleChangeTime}
                placeholder="Time"
              />
            </ComponentCategory>

            <ComponentCategory
              category={windowWidth < 1260 ? "Time range" : ""}
            >
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
                  handleChange={editableTournamentsSettings.handleChangeDateEnd}
                  className={cx(classes.input, classes.inputTime)}
                />
              </div>
            </ComponentCategory>
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
              <div className={classes.line} style={{ margin: "0 2px" }} />
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
  );
};
