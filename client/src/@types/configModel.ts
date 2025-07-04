import { Networks } from "./common";

export interface ConfigModel {
  alias: string;
  networks: { [key in "ko" | "freezout" | "mystery"]: Networks };
  mail: string;
  password: string;
  timezone: string;
  address: string | null;
  time1: string | null;
  time2: string | null;
  normalTime: string | null;
  turboTime: string | null;
  superTurboTime: string | null;
}

export interface defaultConfigModel {
  alias: string;
  level: number | string;
  mail: string;
  password: string;
  timezone: string;
  address: string | null;
}
