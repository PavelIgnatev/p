import { createApi } from "effector";
import { MultiValue, SingleValue } from "react-select";
import { selectModel } from "../../@types/selectsModel";
import { $tournamentsSettings, TIMEZONES } from "./state";
import { tournamentsSettingsProps } from "./types";

const saveCurrentState = (curState: tournamentsSettingsProps) => {
  localStorage.setItem("curState", JSON.stringify(curState));
};

export const editableTournamentsSettings = createApi($tournamentsSettings, {
  handleChangeNetwork: (setting, network: MultiValue<selectModel>) => {
    const updatedState = {
      ...setting,
      network,
    };
    saveCurrentState(updatedState);
    return updatedState;
  },
  handleChangeTime: (setting, time: SingleValue<selectModel>) => {
    const updatedState = {
      ...setting,
      time,
    };
    saveCurrentState(updatedState);
    return updatedState;
  },
  handleChangeTimezonetable: (setting, timezoneTable: string) => {
    const updatedState = {
      ...setting,
      timezoneTable,
    };
    saveCurrentState(updatedState);
    return updatedState;
  },
  handleChangeMoneyStart: (setting, moneyStart: number) => {
    const updatedState = {
      ...setting,
      moneyStart,
    };
    saveCurrentState(updatedState);
    return updatedState;
  },
  handleChangeMoneyEnd: (setting, moneyEnd: number) => {
    const updatedState = {
      ...setting,
      moneyEnd,
    };
    saveCurrentState(updatedState);
    return updatedState;
  },
  handleChangePrizepoolStart: (setting, prizepoolStart: number) => {
    const updatedState = {
      ...setting,
      prizepoolStart,
    };
    saveCurrentState(updatedState);
    return updatedState;
  },
  handleChangePrizepoolEnd: (setting, prizepoolEnd: number) => {
    const updatedState = {
      ...setting,
      prizepoolEnd,
    };
    saveCurrentState(updatedState);
    return updatedState;
  },
  handleChangeDateStart: (setting, dateStart: string) => {
    const updatedState = {
      ...setting,
      dateStart: String(Number(dateStart) >= 24 ? 24 : dateStart),
    };
    saveCurrentState(updatedState);
    return updatedState;
  },
  handleChangeDateEnd: (setting, dateEnd: string) => {
    const updatedState = {
      ...setting,
      dateEnd: String(Number(dateEnd) >= 24 ? 24 : dateEnd),
    };
    saveCurrentState(updatedState);
    return updatedState;
  },
  handleChangeKo: (setting, KO: boolean) => {
    const updatedState = {
      ...setting,
      KO,
    };
    saveCurrentState(updatedState);
    return updatedState;
  },
  handleChangeTurbo: (setting, turbo: boolean) => {
    const updatedState = {
      ...setting,
      turbo,
    };
    saveCurrentState(updatedState);
    return updatedState;
  },
  handleChangeSuperTurbo: (setting, superTurbo: boolean) => {
    const updatedState = {
      ...setting,
      superTurbo,
    };
    saveCurrentState(updatedState);
    return updatedState;
  },
  handleChangeFreezout: (setting, freezout: boolean) => {
    const updatedState = {
      ...setting,
      freezout,
    };
    saveCurrentState(updatedState);
    return updatedState;
  },
  handleChangeNormal: (setting, normal: boolean) => {
    const updatedState = {
      ...setting,
      normal,
    };
    saveCurrentState(updatedState);
    return updatedState;
  },
  handleChangeTimezone: (setting, timezone: typeof TIMEZONES[0]) => {
    const updatedState = {
      ...setting,
      timezone,
    };
    saveCurrentState(updatedState);
    return updatedState;
  },
});
