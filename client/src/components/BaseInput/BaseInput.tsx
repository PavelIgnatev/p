import { FC } from "react";
import { BaseInputModel } from "./types";
import classes from "./BaseInput.module.scss";
import cx from "classnames";

export const BaseInput: FC<BaseInputModel> = ({
  handleChange,
  value,
  max,
  placeholder,
  className,
}) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(
      Math.max(
        Math.min(
          Number(/\d+/.test(String(Number(e.currentTarget.value))) ? e.target.value : value ?? 0),
          max,
        ),
        0,
      ),
    );
  };

  return (
    <div className={classes.BaseInput}>
      <label htmlFor={placeholder} className={classes.label}>
        {placeholder}:
      </label>
      <input
        id={placeholder}
        value={value ?? 0}
        onChange={onChange}
        placeholder={placeholder}
        className={cx(classes.input, className)}
      />
    </div>
  );
};
