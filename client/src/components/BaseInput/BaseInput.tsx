import { FC } from "react";
import { BaseInputModel } from "./types";
import classes from "./BaseInput.module.scss";
import cx from "classnames";

export const BaseInput: FC<BaseInputModel> = ({
  handleChange,
  value,
  max,
  min = 0,
  placeholder,
  className,
  htmlId,
}) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(
      Math.max(
        min,
        Math.min(max, e.target.value === "" ? min : Number(e.target.value))
      )
    );
  };

  return (
    <div className={classes.BaseInput}>
      <label htmlFor={placeholder} className={classes.label}>
        {placeholder}:
      </label>
      <input
        id={htmlId}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className={cx(classes.input, className)}
        max={max}
        min={min}
      />
    </div>
  );
};
