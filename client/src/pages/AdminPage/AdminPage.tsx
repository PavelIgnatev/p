import { useStore } from "effector-react";
import { FC, useEffect } from "react";

import { AliasesSection } from "../../components/Admin.AliasesSection";
import {
  OnPasswordSubmit,
  PasswordSection,
  PasswordSectionType,
} from "../../components/PasswordSection";
import {
  $isValidAdminPassword,
  validateAdminPasswordRequest,
} from "../../store/Password";
import { OffpeakSection } from "../../components/OffpeakSection";
import { getOffpeak } from "../../store/Offpeak";
import { RulesSection } from "../../components/Admin.RulesSection";
import { getUpdate } from "../../store/Update";
import { UpdateSection } from "../../components/UpdateSection";
import StopWordsSection from "../../components/Admin.StopWordsSection";
import { getStopWords } from "../../store/StopWords";
import { ScoreSection } from "../../components/Admin.ScoreSection";
import { UserSection } from "../../components/Admin.UserSection";
import { PercentSection } from "../../components/SampleSection";
import { Thermometer } from "../../components/Thermometer";
import { $theme, toggleTheme } from "../../store/Theme";
import Switch from "react-switch";
import classes from "./AdminPage.module.scss";

export const AdminPage: FC = () => {
  const isAdmin = useStore($isValidAdminPassword);
  const theme = useStore($theme);

  useEffect(() => {
    getStopWords();
    getUpdate();
    getOffpeak();
  }, [isAdmin]);

  const handlePasswordSubmit: OnPasswordSubmit = ({ password }) =>
    validateAdminPasswordRequest(password);

  if (!isAdmin) {
    return (
      <PasswordSection
        onSubmit={handlePasswordSubmit}
        type={PasswordSectionType.ADMIN}
      />
    );
  }

  return (
    <>
      <section className={classes.header}>
        <div className={classes.title}>
          Welcome to <strong>Admin Panel</strong>
        </div>
        <div className={classes.themeToggle}>
          <Switch
            onChange={() => toggleTheme()}
            checked={theme === "dark"}
            onColor="#374151"
            offColor="#e5e7eb"
            onHandleColor="#ffffff"
            offHandleColor="#ffffff"
            handleDiameter={24}
            className={classes.themeSwitchButton}
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
                  fill="gold"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
                </svg>
              </div>
            }
          />
        </div>
      </section>
      <UpdateSection />
      <OffpeakSection />
      <StopWordsSection />
      <PercentSection />
      <Thermometer />
      <ScoreSection />
      <RulesSection />
      <AliasesSection />
      <UserSection />
    </>
  );
};
