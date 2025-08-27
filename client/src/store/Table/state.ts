import { timeStringToMilliseconds } from "./../../helpers/timeStringToMilliseconds";
import { findTournamentWithDiapzone } from "./../../helpers/findTournamentWithDiapzone";
import { createStore, combine, createEvent, createEffect } from "effector";
import { Theme } from "../types";
import { processArrayInChunks, filterArrayInChunks } from "../../helpers/asyncProcessor";

import { getDate } from "./../../helpers/getDate";
import { getWeekday } from "./../../helpers/getWeekday";
import { getTimeBySec } from "./../../helpers/getTimeBySec";
import { isSat } from "./../../helpers/isSat";
import { isRebuy } from "./../../helpers/isRebuy";
import { getStatus } from "./../../helpers/getStatus";
import { isSuperTurbo } from "./../../helpers/isSuperTurbo";
import { isTurbo } from "./../../helpers/isTurbo";
import { isNormal } from "./../../helpers/isNormal";
import { isMystery } from "./../../helpers/isMystery";
import { getTimeByMS } from "./../../helpers/getTimeByMS";

import { tableCellModel } from "../../@types/tableCellModel";
import { $tournamentsSettings } from "../Select";

import { getNetwork } from "./../../helpers/getNetwork";
import { $config } from "../Config";
import { $filterContent } from "../Filter";
import { $store } from "../Store";
import { $stopWords } from "../StopWords";
import { $colors } from "../Colors";

import { dateToTimeString } from "../../helpers/dateToTimeString";
import { $theme } from "../Theme";

export const $tableState = createStore<tableCellModel[] | null | undefined>(
  null
);

export const $isProcessing = createStore<boolean>(false);
export const $processedCount = createStore<number>(0);
export const $totalCount = createStore<number>(0);

export const setProcessing = createEvent<boolean>();
export const setProcessedCount = createEvent<number>();
export const setTotalCount = createEvent<number>();

$isProcessing.on(setProcessing, (_, processing) => processing);
$processedCount.on(setProcessedCount, (_, count) => count);
$totalCount.on(setTotalCount, (_, count) => count);

function addTime(time1: string, time2: string, subtract = false) {
  var [hours1, minutes1] = time1.split(":").map(Number);
  var [hours2, minutes2] = time2.split(":").map(Number);

  var totalMinutes = subtract
    ? hours1 * 60 + minutes1 - (hours2 * 60 + minutes2)
    : hours1 * 60 + minutes1 + (hours2 * 60 + minutes2);
  var finalMinutes = (totalMinutes + 1440) % 60;
  var finalHours = Math.floor((totalMinutes + 1440) / 60) % 24;

  var result =
    ("0" + finalHours).slice(-2) + ":" + ("0" + finalMinutes).slice(-2);

  return result;
}

export const processTableDataAsync = createEffect(async (params: {
  tournaments: tableCellModel[];
  currentTheme: Theme;
  tournamentsSettings: any;
  config: any;
  filterContent: any;
  store: any;
  stopWords: string[];
  colors: any;
}) => {
  const {
    tournaments,
    currentTheme,
    tournamentsSettings,
    config,
    filterContent,
    store,
    stopWords,
    colors
  } = params;

  setProcessing(true);
  setTotalCount(tournaments.length);
  setProcessedCount(0);

  try {
    const { timezone } = config ?? {};
    const processedTournaments = tournaments.map((tournament, index) => {
      setProcessedCount(index + 1);
      return tournament;
    });

    // const filteredTournaments = await filterArrayInChunks(
    //   processedTournaments,
    //   (tournament) => {
    //     const bounty = tournament["@bounty"];
    //     const turbo = tournament["@turbo"];
    //     const superturbo = tournament["@superturbo"];
    //     const prizepool = tournament["@usdPrizepool"];

    //     return (
    //       Number(tournament["@usdBid"]) >= Number(moneyStart) &&
    //       Number(tournament["@usdBid"]) <= Number(moneyEnd) &&
    //       ((isKOQ !== false && isNormalQ !== false
    //         ? bounty && !turbo && !superturbo
    //         : false) ||
    //         (isKOQ !== false && isTurboQ !== false ? bounty && turbo : false) ||
    //         (isKOQ !== false && isSTurboQ !== false
    //           ? bounty && superturbo
    //           : false) ||
    //         (isFreezoutQ !== false && isNormalQ !== false
    //           ? !bounty && !turbo && !superturbo
    //           : false) ||
    //         (isFreezoutQ !== false && isTurboQ !== false
    //           ? !bounty && turbo
    //           : false) ||
    //         (isFreezoutQ !== false && isSTurboQ !== false
    //           ? !bounty && superturbo
    //           : false)) &&
    //       (prizepool !== "-"
    //         ? Number(prizepoolStart) <= Number(prizepool) &&
    //           Number(prizepool) <= Number(prizepoolEnd)
    //         : true)
    //     );
    //   },
    //   100
    // );

    // const timeFilteredTournaments = await filterArrayInChunks(
    //   filteredTournaments,
    //   (item) => {
    //     const startDate = item?.["@scheduledStartDate"] ?? "-";

    //     if (!item.valid) return false;
    //     if (startDate === "-") return true;

    //     const res = startDate?.split(", ")?.[1]?.split(":")?.[0];
    //     const r = dateEnd === "00" && dateStart <= dateEnd ? "24" : dateEnd;

    //     return dateStart <= dateEnd
    //       ? dateStart <= res && res <= r
    //       : !(dateStart > res && res > dateEnd);
    //   },
    //   100
    // );

    // const finalFilteredTournaments = await filterArrayInChunks(
    //   timeFilteredTournaments,
    //   (item) => {
    //     const duration = item?.["@duration"];
    //     const { time1, time2, normalTime, turboTime, superTurboTime } = config ?? {};
    //     const startDate =
    //       item?.["@scheduledStartDate"] !== "-"
    //         ? item?.["@scheduledStartDate"]
    //         : item?.["@lateRegEndDate"] ?? "-";
    //     const regDate =
    //       item?.["@lateRegEndDate"] !== "-"
    //         ? item?.["@lateRegEndDate"]
    //         : item?.["@scheduledStartDate"] ?? "-";
    //     const turbo = item?.["@turbo"];
    //     const superturbo = item?.["@superturbo"];
    //     const normal = !turbo && !superturbo;

    //     if (
    //       startDate === "-" ||
    //       (startDate === "-" && (!duration || duration === "-")) ||
    //       !time1 ||
    //       !time2
    //     )
    //       return true;

    //     const now = startDate?.split(", ")?.[1];
    //     const reg = regDate?.split(", ")?.[1];
    //     const sDate = item?.["@scheduledStartDate"]?.split(", ")?.[1];
    //     const rDate = item?.["@lateRegEndDate"]?.split(", ")?.[1];

    //     const res = addTime(
    //       now,
    //       !duration || duration === "-" ? "00:00" : duration
    //     );
    //     const r = time2 === "00:00" && time1 <= time2 ? "24:00" : time2;

    //     if (normal && normalTime) {
    //       const normalEndTime = addTime(time1, normalTime);
    //       const r =
    //         normalEndTime === "00:00" && time1 <= normalEndTime
    //           ? "24:00"
    //           : normalEndTime;

    //       const isStartDateFull =
    //         time1 <= normalEndTime
    //           ? time1 <= sDate && sDate <= r
    //           : !(time1 > sDate && sDate > normalEndTime);
    //       const isRegDateFull =
    //         time1 <= normalEndTime
    //           ? time1 <= rDate && rDate <= r
    //           : !(time1 > rDate && rDate > normalEndTime);

    //       if (
    //         !(
    //           (sDate !== "-" && isStartDateFull) ||
    //           (rDate !== "-" && isRegDateFull)
    //         )
    //       ) {
    //         return false;
    //       }
    //     }

    //     if (turbo && turboTime) {
    //       const turboEndTime = addTime(time1, turboTime);
    //       const r =
    //         turboEndTime === "00:00" && time1 <= turboEndTime
    //           ? "24:00"
    //           : turboEndTime;

    //       const isStartDateFull =
    //         time1 <= turboEndTime
    //           ? time1 <= sDate && sDate <= r
    //           : !(time1 > sDate && sDate > turboEndTime);
    //       const isRegDateFull =
    //         time1 <= turboEndTime
    //           ? time1 <= rDate && rDate <= r
    //           : !(time1 > rDate && rDate > turboEndTime);

    //       if (
    //         !(
    //           (sDate !== "-" && isStartDateFull) ||
    //           (rDate !== "-" && isRegDateFull)
    //         )
    //       ) {
    //         return false;
    //       }
    //     }

    //     if (superturbo && superTurboTime) {
    //       const superTurboEndTime = addTime(time1, superTurboTime);
    //       const r =
    //         superTurboEndTime === "00:00" && time1 <= superTurboEndTime
    //           ? "24:00"
    //           : superTurboEndTime;

    //       const isStartDateFull =
    //         time1 <= superTurboEndTime
    //           ? time1 <= sDate && sDate <= r
    //           : !(time1 > sDate && sDate > superTurboEndTime);
    //       const isRegDateFull =
    //         time1 <= superTurboEndTime
    //           ? time1 <= rDate && rDate <= r
    //           : !(time1 > rDate && rDate > superTurboEndTime);

    //       if (
    //         !(
    //           (sDate !== "-" && isStartDateFull) ||
    //           (rDate !== "-" && isRegDateFull)
    //         )
    //       ) {
    //         return false;
    //       }
    //     }

    //     return time1 <= time2
    //       ? time1 <= res && res <= r && time1 <= reg && reg <= r
    //       : !((time1 > res && res > time2) || (time1 > reg && reg > time2));
    //   },
    //   100
    // );

    const ignoredKeys = ["@id", "@lastUpdateTime"];

    // // Оптимизированная функция определения дубликатов
    // const areObjectsEqual = (obj1: tableCellModel, obj2: tableCellModel) => {
    //   // Сравниваем только ключевые поля вместо всего объекта
    //   const keyFields = ["@name", "@network", "@stake", "@rake", "@scheduledStartDate", "@lateRegEndDate", "@entrants", "@reEntries"];
      
    //   for (const key of keyFields) {
    //     // @ts-ignore
    //     if (obj1[key] !== obj2[key]) {
    //       return false;
    //     }
    //   }
    //   return true;
    // };

    // // Используем Map для O(N) сложности вместо O(N²)
    // const seen = new Map<string, boolean>();
    // const uniqueTournaments = finalFilteredTournaments.filter((item) => {
    //   // Создаем ключ из ключевых полей
    //   const key = `${item["@name"]}_${item["@network"]}_${item["@stake"]}_${item["@rake"]}_${item["@scheduledStartDate"]}_${item["@lateRegEndDate"]}`;
      
    //   if (seen.has(key)) {
    //     return false;
    //   }
      
    //   seen.set(key, true);
    //   return true;
    // });

    setProcessing(false);
    return processedTournaments;
  } catch (error) {
    setProcessing(false);
    throw error;
  }
});

export const $asyncFilteredState = createStore<tableCellModel[]>([]);

$asyncFilteredState.on(processTableDataAsync.doneData, (_, data) => data);
$asyncFilteredState.on(processTableDataAsync.fail, () => []);
$asyncFilteredState.on(processTableDataAsync, () => []);

const clearAsyncFilteredState = createEvent();
$asyncFilteredState.on(clearAsyncFilteredState, () => []);

export const $filtredTableState = combine(
  $tableState,
  $asyncFilteredState,
  $isProcessing,
  (rawTournaments, processedTournaments, isProcessing) => {
    if (isProcessing || !rawTournaments) {
      return processedTournaments;
    }
    
    return processedTournaments;
  }
);

export const triggerAsyncProcessing = createEvent<{
  tournaments: tableCellModel[];
  currentTheme: Theme;
  tournamentsSettings: any;
  config: any;
  filterContent: any;
  store: any;
  stopWords: string[];
  colors: any;
}>();

triggerAsyncProcessing.watch((params) => {
  const { tournaments, currentTheme, tournamentsSettings, config, filterContent, store, stopWords, colors } = params;

  if (!tournaments || tournaments.length === 0) {
    clearAsyncFilteredState();
    return;
  }

  clearAsyncFilteredState();
  setProcessedCount(0);
  setTotalCount(0);

  processTableDataAsync({
    tournaments,
    currentTheme,
    tournamentsSettings,
    config,
    filterContent,
    store,
    stopWords,
    colors
  });
});
