import { ADDRESS } from "./../Select/state";
import { createStore } from "effector";

import { TIMEZONES } from "../Select";
import { ConfigModel } from "./../../@types/configModel";

export const $config = createStore<ConfigModel | null>(null);

export const DEFAULT_EDITABLE_CONFIG: ConfigModel = {
  alias: "",
  networks: { ko: {}, freezout: {} },
  mail: "",
  password: "",
  timezone: TIMEZONES[0].value,
  address: ADDRESS[0].value,
  time1: "00:00",
  time2: "00:00",
  normalTime: "00:00",
  turboTime: "00:00",
  superTurboTime: "00:00",
};
export const $editableConfig = createStore<ConfigModel>(
  DEFAULT_EDITABLE_CONFIG
);
