import { FC, RefObject, useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";

import { SelectOption } from "../../../@types/selectsModel";
import { ConfigModel } from "../../../@types/configModel";
import EyeIcon from "../../../assets/icons/eye.svg";
import { editableConfigEvents } from "../../../store/Config";
import {
  editableTournamentsSettings,
  TIMEZONES,
  EFFMU,
  ADDRESS,
  EFFMUForUsers,
} from "../../../store/Select";

import { specialSelectStyles } from "../../BaseSelect";
import { BaseInputString } from "../../BaseInputString";

import b_ from "b_";
import { BaseButton } from "../../BaseButton";
import { Modal, ModalRef } from "../../Modal";
import { ApprovalSection } from "../../ApprovalSection";
import TimeField from "react-simple-timefield";

// type ColorsType = "green" | "yellow" | "red" | "rgb(152, 183, 201)";
interface Props {
  config: ConfigModel;
  isAdminPage?: boolean;
  onDeleteCache: () => void;
}

const nativeSelectStyles = {
  ...specialSelectStyles,
  control: (provided: object, state: any) => ({
    ...specialSelectStyles.control(provided, state),
    fontWeight: 700,
    fontSize: "20px",
    width: "150px",
  }),
};

const b = b_.with("user-settings-info");

const LevelInfo = {
  A: { A: "No Stips", B: "No Stips", C: "No Stips", SuperA: "No Stips" },
  B: { A: "$0 - $250", B: "$251 - $500", C: "$501+", SuperA: "No Stips" },
  0: { A: "$0-$400", B: "$401-$800", C: "$801+", SuperA: "No Stips" },
  1: { A: "$0-$1k", B: "$1001-$2k", C: "$2001+", SuperA: "No Stips" },
  2: { A: "$0-$1.5k", B: "$1501-$3k", C: "$3001+", SuperA: "No Stips" },
  3: {
    A: "$0-$2.5k",
    B: "$2501-$5k",
    C: "$5001+",
    SuperA: "No Stips",
  },
  4: {
    A: "$0-$4k",
    B: "$4001-$8k",
    C: "$8001+",
    SuperA: "No Stips",
  },
  5: {
    A: "$0-$5k",
    B: "$5001-$10k",
    C: "$10001+",
    SuperA: "No Stips",
  },
  6: {
    A: "$0-$7k",
    B: "$7001-$14k",
    C: "$14001+",
    SuperA: "No Stips",
  },
  7: { A: "$0-$7.5k", B: "$7501-$15k", C: "$15001+", SuperA: "No Stips" },
  8: { A: "$0-$8k", B: "$8001-$16k", C: "$16001+", SuperA: "No Stips" },
  9: {
    A: "$0-$10k",
    B: "$10001-$20k",
    C: "$20001+",
    SuperA: "No Stips",
  },
  10: {
    A: "$0-$12.5k",
    B: "$12501-$25k",
    C: "$25001+",
    SuperA: "No Stips",
  },
  11: {
    A: "$0-$15k",
    B: "$15001-$30k",
    C: "$30001+",
    SuperA: "No Stips",
  },
  12: { A: "$0-$20k", B: "$20001-$40k", C: "$40001+", SuperA: "No Stips" },
  13: { A: "$0-$25k", B: "$25001-$50k", C: "$50001+", SuperA: "No Stips" },
  14: { A: "$0-$30k", B: "$30001-$60k", C: "$60001+", SuperA: "No Stips" },
  15: {
    A: "$40,001 - $100k",
    B: "$100,001 - $200k",
    C: "$200,001+",
    SuperA: "$0 - $40k",
  },
  16: { A: "No Stips", B: "No Stips", C: "No Stips", SuperA: "No Stips" },
};

// const ColorsInfo: Record<ColorsType, string> = {
//   green: "Good",
//   yellow: "Normal, you can play",
//   red: "You can play, but difficult",
//   "rgb(152, 183, 201)": "You can play, but there is no information",
// };

export const UserSettingsInfo: FC<Props> = ({
  config,
  isAdminPage,
  onDeleteCache,
  children,
}) => {
  const { alias, mail, password, timezone, networks, address } = config;
  const [showPassword, setShowPassword] = useState(false);
  const [isSuperA, setIsSuperA] = useState(true);
  const [isOneSuperA, setIsOneSuperA] = useState(false);
  const deleteModalRef = useRef<ModalRef>(null);

  useEffect(() => {
    for (let type of Object.keys(networks)) {
      for (
        let i = 0;
        i < Object.keys(networks[type as "ko" | "freezout"]).length;
        i++
      ) {
        if (
          networks[type as "ko" | "freezout"][
            Object.keys(networks[type as "ko" | "freezout"])[i]
          ].effmu !== "SuperA"
        ) {
          setIsSuperA(false);
          break;
        } else setIsOneSuperA(true);
      }
    }
  }, [networks]);

  const toggleShowPassword = () => setShowPassword((p) => !p);

  const defaultTimezoneOption =
    TIMEZONES.find((option) => option.value === timezone) || TIMEZONES[0];

  const defaultAddressOption =
    ADDRESS.find((option) => option.value === address) || ADDRESS[0];

  const handleEmailChange = (email: string) =>
    editableConfigEvents.handleChangeMail(email);
  const handlePasswordChange = (password: string) =>
    editableConfigEvents.handleChangePassword(password);
  const handleTimezoneChange = (option: SelectOption<typeof TIMEZONES[0]>) =>
    editableConfigEvents.handleTimezoneChange(option.value);
  const handleAddressChange = (option: SelectOption<typeof ADDRESS[0]>) =>
    editableConfigEvents.handleAddressChange(option.value);
  const handleAllEffmuChange = (option: SelectOption<typeof EFFMU[0]>) =>
    editableConfigEvents.handleChangeEffmuAll(option.value);
  const handleModalClose = (ref: RefObject<ModalRef>) => {
    ref.current?.close();
  };
  const handleModalOpen = (ref: RefObject<ModalRef>) => ref.current?.open();

  const levels = useMemo(() => {
    const levels = [
      ...Object.keys(networks["ko"]).map(
        (network) => networks["ko"][network].level
      ),
      ...Object.keys(networks["freezout"]).map(
        (network) => networks["freezout"][network].level
      ),
    ];

    return levels
      .filter(function (item, level) {
        return levels.indexOf(item) === level;
      })
      .slice(0, 3);
  }, [networks]) as Array<keyof typeof LevelInfo>;

  const isOnlyFiveTeens = useMemo(() => {
    return levels.length === 1 && levels[0] === 15;
  }, [levels]);

  useEffect(() => {
    editableTournamentsSettings.handleChangeTimezone(defaultTimezoneOption);
  }, [defaultTimezoneOption]);

  return (
    <div className={b()}>
      <div className={b("header")}>
        <div className={b("header-conent")}>
          <span className={b("header-alias")}>
            <b>Alias:</b> {alias}
          </span>
          {!isAdminPage && (
            <>
              <span
                className={b("header-password")}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <b>Password:</b>
                <div
                  className={b("header-password-block")}
                  onClick={toggleShowPassword}
                >
                  <span
                    className={b("header-password-text", {
                      hidden: !showPassword,
                    })}
                  >
                    {showPassword ? password : "****"}
                  </span>
                  <img
                    className={b("header-password-img")}
                    src={EyeIcon}
                    alt=""
                  />
                </div>
                <BaseButton
                  style={{
                    fontSize: 16,
                    marginLeft: 10,
                    width: 120,
                    height: 34,
                  }}
                  onClick={() => handleModalOpen(deleteModalRef)}
                  disabled={false}
                >
                  Clear cache
                </BaseButton>
                <Modal ref={deleteModalRef}>
                  <ApprovalSection
                    title="Do you really want to clear the account cache?"
                    onApprove={() => {
                      onDeleteCache();
                      handleModalClose(deleteModalRef);
                    }}
                    onClose={() => handleModalClose(deleteModalRef)}
                  />
                </Modal>
              </span>
            </>
          )}
        </div>
      </div>
      <div className={b("settings")}>
        <div className={b("times-wrapper")}>
          <div className={b("times-wrapper-wrapper")}>
            <p>
              <strong>Session start time</strong>
            </p>

            <div style={{ display: "flex", width: "100%" }}>
              <TimeField
                value={config?.time1 ?? "--:--"}
                onChange={(e, value) =>
                  editableConfigEvents.handleChangeTime1(value)
                }
                style={{ width: "100%" }}
              />
              <BaseButton
                className={b("rule-row-control-btn")}
                onClick={() => editableConfigEvents.handleChangeTime1(null)}
                style={{ marginLeft: "10px" }}
              >
                Х
              </BaseButton>
            </div>
          </div>
          <div className={b("times-wrapper-wrapper")}>
            <p>
              <strong>Session end time</strong>
            </p>

            <div style={{ display: "flex", width: "100%" }}>
              <TimeField
                value={config?.time2 ?? "--:--"}
                onChange={(e, value) =>
                  editableConfigEvents.handleChangeTime2(value)
                }
                style={{ width: "100%" }}
              />
              <BaseButton
                className={b("rule-row-control-btn")}
                onClick={() => editableConfigEvents.handleChangeTime2(null)}
                style={{ marginLeft: "10px" }}
              >
                Х
              </BaseButton>
            </div>
          </div>
        </div>
        <div className={b("times-wrapper")}>
          <div className={b("times-wrapper-wrapper")}>
            <p>
              <strong>Filter Normal</strong> after session start via
            </p>

            <div style={{ display: "flex", width: "100%" }}>
              <TimeField
                value={config?.normalTime ?? "--:--"}
                onChange={(e, value) =>
                  editableConfigEvents.handleChangeNormalTime(value)
                }
                style={{ width: "100%" }}
              />
              <BaseButton
                className={b("rule-row-control-btn")}
                onClick={() =>
                  editableConfigEvents.handleChangeNormalTime(null)
                }
                style={{ marginLeft: "10px" }}
              >
                Х
              </BaseButton>
            </div>
          </div>
          <div className={b("times-wrapper-wrapper")}>
            <p>
              <strong>Filter Turbo</strong> after session start via
            </p>

            <div style={{ display: "flex", width: "100%" }}>
              <TimeField
                value={config?.turboTime ?? "--:--"}
                onChange={(e, value) =>
                  editableConfigEvents.handleChangeTurboTime(value)
                }
                style={{ width: "100%" }}
              />
              <BaseButton
                className={b("rule-row-control-btn")}
                onClick={() => editableConfigEvents.handleChangeTurboTime(null)}
                style={{ marginLeft: "10px" }}
              >
                Х
              </BaseButton>
            </div>
          </div>
          <div className={b("times-wrapper-wrapper")}>
            <p>
              <strong>Filter Super Turbo</strong> after session start via
            </p>

            <div style={{ display: "flex", width: "100%" }}>
              <TimeField
                value={config?.superTurboTime ?? "--:--"}
                onChange={(e, value) =>
                  editableConfigEvents.handleChangeSuperTurboTime(value)
                }
                style={{ width: "100%" }}
              />
              <BaseButton
                className={b("rule-row-control-btn")}
                onClick={() =>
                  editableConfigEvents.handleChangeSuperTurboTime(null)
                }
                style={{ marginLeft: "10px" }}
              >
                Х
              </BaseButton>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "15px" }}> {children}</div>
        <div className={b("settings-wrapper")} style={{ marginTop: "15px" }}>
          <div className={b("effmu-wrapper")}>
            <b className={b("label")}>Effmu All</b>
            <Select
              options={
                isAdminPage
                  ? EFFMU
                  : isSuperA || isOnlyFiveTeens
                  ? EFFMU
                  : EFFMUForUsers
              }
              // @ts-ignore
              onChange={handleAllEffmuChange}
              className={b("input", { effmu: true })}
              styles={nativeSelectStyles}
              placeholder="Effmu all"
            />
          </div>
          <div className={b("timezones-wrapper")}>
            <b className={b("label")}>Timezone</b>
            <Select
              options={TIMEZONES}
              defaultValue={defaultTimezoneOption}
              // @ts-ignore
              onChange={handleTimezoneChange}
              className={b("input", { timezone: true })}
              styles={nativeSelectStyles}
            />
          </div>
          {isAdminPage && (
            <div className={b("address-wrapper")}>
              <b className={b("label")}>Address</b>
              <Select
                options={ADDRESS}
                defaultValue={defaultAddressOption}
                // @ts-ignore
                onChange={handleAddressChange}
                className={b("input", { timezone: true })}
                styles={nativeSelectStyles}
              />
            </div>
          )}
        </div>
        {isAdminPage && (
          <div className={b("email-wrapper")}>
            <b className={b("label")}>E-mail</b>
            <BaseInputString
              value={mail}
              onChange={handleEmailChange}
              className={b("input", { text: true })}
            />
          </div>
        )}
      </div>
      {isAdminPage && (
        <div className={b("password-wrapper")}>
          <b className={b("label")}>Password</b>
          <BaseInputString
            value={password}
            onChange={handlePasswordChange}
            className={b("input", { text: true })}
            disabled={!isAdminPage}
          />
        </div>
      )}
      {/* <div className={b("additional-info")}>
        <div className={b("additional-info-line")}>
          <img src={InfoIcon} alt="info" />
          Here you can change the Eff mu and E-mail for {whichAccount} account
        </div>
        <div className={b("additional-info-line")}>
          <img src={MailIcon} alt="mail" />
          Previously played tournaments that do not comply with the team's rules
          will be sent to
          {whichAccount} email every day
        </div>
        {!isAdminPage && (
          <div className={b("additional-info-line")}>
            <img src={SettingsIcon} alt="levels" />
            To change the level of {whichAccount} account on a particular
            network, contact the administrators
          </div>
        )}
      </div> */}
      <div className={b("effmu-content")}>
        {levels.map((level) => (
          <div key={level}>
            <b className={b("label", { content: true })}>Level {level}:</b>
            {(isOneSuperA || level === 15) && (
              <div className={b("effmu", { type: "SuperA" })}>
                SuperA {LevelInfo?.[level]?.["SuperA"]}
              </div>
            )}
            <div className={b("effmu", { type: "a" })}>
              A {LevelInfo?.[level]?.["A"]}
            </div>
            <div className={b("effmu", { type: "b" })}>
              B {LevelInfo?.[level]?.["B"]}
            </div>
            <div className={b("effmu", { type: "c" })}>
              C {LevelInfo?.[level]?.["C"]}
            </div>
          </div>
        ))}
      </div>
      {/* {Object.keys(ColorsInfo).map((color) => {
        return (
          <div key={color} className={b("color")}>
            <div className={b("circle")} style={{ backgroundColor: color }} />
            <div className={b("additional-info", { color: true })}>
              {ColorsInfo[color as ColorsType]}
            </div>
          </div>
        );
      })} */}
    </div>
  );
};
