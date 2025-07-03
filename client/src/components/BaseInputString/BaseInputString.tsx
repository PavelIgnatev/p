import classNames from "classnames";
import { FC, KeyboardEvent } from "react";
import "./BaseInputString.scss";

type BaseInputStringProps = {
  value: string | undefined;
  onChange: (v: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  autoCorrect?: string;
  spellCheck?: boolean;
};

export const BaseInputString: FC<BaseInputStringProps> = ({
  onChange,
  className,
  value,
  disabled,
  placeholder,
  type = "text",
  onKeyPress,
  autoComplete = "off",
  autoCorrect = "off",
  spellCheck = false
}) => {
  return (
    <input
      className={classNames("BaseInputString", className)}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      disabled={disabled}
      placeholder={placeholder}
      type={type}
      onKeyPress={onKeyPress}
      autoComplete={autoComplete}
      autoCorrect={autoCorrect}
      spellCheck={spellCheck}
    />
  );
};
