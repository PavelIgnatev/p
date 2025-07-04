import b_ from "b_";
import { useStore } from "effector-react";
import { FC, useCallback, useState } from "react";

import { $password, handleChangePassword } from "../../store/Password";

import { BaseButton } from "../BaseButton";
import { BaseInputString } from "../BaseInputString";

import "./PasswordSection.scss";

export enum PasswordSectionType {
  ALIAS = "alias",
  ADMIN = "admin",
}

export type OnPasswordSubmit = ({
  password,
  login,
}: {
  password: string;
  login: string;
}) => void;

interface Props {
  onSubmit: OnPasswordSubmit;
  type?: PasswordSectionType;
}

const b = b_.with("password-section");

export const PasswordSection: FC<Props> = ({ onSubmit, type }) => {
  const [login, setLogin] = useState(localStorage.getItem("login") ?? "");
  const password = useStore($password);

  const isAdmin = type === PasswordSectionType.ADMIN;
  const isAlias = type === PasswordSectionType.ALIAS || !type;

  const whosePassword = isAdmin ? "Admin" : "Your";

  const handleChangeLogin = useCallback((v: string) => {
    localStorage.setItem("login", v);
    setLogin(v);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!password.trim() || (isAlias && !login.trim())) {
      return;
    }
    onSubmit({ password, login });
  }, [password, login, isAlias, onSubmit]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <section className={b()}>
      <div className={b("content-wrapper")}>
        <h1 className={b("title")}>
          {isAdmin ? "Admin Access" : "Pocarr game search"}
        </h1>

        {isAlias && (
          <div className={b("input-wrapper")}>
            <span className={b("label")}>
              <strong>Your alias</strong>
            </span>
            <BaseInputString
              className={b("input")}
              value={login}
              onChange={handleChangeLogin}
              placeholder="Enter your alias"
              onKeyPress={handleKeyPress}
            />
          </div>
        )}

        <div className={b("input-wrapper")}>
          <span className={b("label")}>
            <strong>{whosePassword} password</strong>
          </span>
          <BaseInputString
            className={b("input")}
            value={password}
            onChange={handleChangePassword}
            type="password"
            placeholder="Enter your password"
            onKeyPress={handleKeyPress}
          />
        </div>

        <BaseButton
          className={b("submit-button")}
          onClick={handleSubmit}
          disabled={!password.trim() || (isAlias && !login.trim())}
        >
          Login
        </BaseButton>
      </div>
    </section>
  );
};
