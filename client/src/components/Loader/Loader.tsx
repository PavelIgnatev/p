import { FC } from "react";
import classes from "./Loader.module.scss";

export const Loader: FC<{ style?: React.CSSProperties }> = ({ style }) => {
  return (
    <div className={classes.wrapper} style={style}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
