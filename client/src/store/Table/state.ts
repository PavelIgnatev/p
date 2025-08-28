import { timeStringToMilliseconds } from "./../../helpers/timeStringToMilliseconds";
import { findTournamentWithDiapzone } from "./../../helpers/findTournamentWithDiapzone";
import { createStore, combine, createEvent, createEffect } from "effector";
import { Theme } from "../types";

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
export const $currentStage = createStore<number>(1);
export const $totalStages = createStore<number>(5);

export const setProcessing = createEvent<boolean>();
export const setProcessedCount = createEvent<number>();
export const setTotalCount = createEvent<number>();
export const setCurrentStage = createEvent<number>();
export const setTotalStages = createEvent<number>();

$isProcessing.on(setProcessing, (_, processing) => processing);
$processedCount.on(setProcessedCount, (_, count) => count);
$totalCount.on(setTotalCount, (_, count) => count);
$currentStage.on(setCurrentStage, (_, stage) => stage);
$totalStages.on(setTotalStages, (_, stages) => stages);

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

export const processTableDataAsync = createEffect(
  async (params: {
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
      colors,
    } = params;

    setProcessing(true);
    setTotalCount(tournaments.length);
    setProcessedCount(0);

    try {
      const { filter, scores } = filterContent;
      const { currency: lastValue, offpeak, score1, evscore: evScore } = store;

      const {
        moneyStart,
        moneyEnd,
        KO: isKOQ,
        turbo: isTurboQ,
        superTurbo: isSTurboQ,
        freezout: isFreezoutQ,
        normal: isNormalQ,
        prizepoolStart,
        prizepoolEnd,
        dateStart,
        dateEnd,
      } = tournamentsSettings;

      const { networks, timezone } = config ?? {};

      const validateName = (name: string, stopWords: string[]) => {
        if (!name) return "";

        let cleanedName = name
          .toLowerCase()
          .replace(/[^\w]/gi, "")
          .replace(/\d+/g, "");

        stopWords.forEach((word) => {
          cleanedName = cleanedName.replace(new RegExp(word, "g"), "");
        });

        return cleanedName;
      };

      const getColorByScore = (
        score: any,
        evscore: any,
        colors: any,
        isLight: boolean
      ) => {
        if (score === "-" || !evscore) {
          return isLight ? "rgb(238, 236, 255)" : "rgb(80, 80, 95)";
        }

        const diff =
          Number(!score || score === "-" ? 100 : score) -
          Number(evscore || 100);
        const numForGreen = colors?.[1] || 0;
        const numForOrange = colors?.[2] || 0;
        const numForYellow = colors?.[3] || 0;

        if (-100 <= diff && diff < numForGreen) {
          return isLight ? "#74ce74" : "#5bb85b";
        }
        if (numForGreen <= diff && diff < numForOrange) {
          return isLight ? "yellow" : "#d4af37";
        }
        if (numForOrange <= diff && diff < numForYellow) {
          return isLight ? "#ffa90c" : "#cc8a0c";
        }
        return isLight ? "#fd6767" : "#cc5555";
      };

      const isLight = currentTheme === "light";

      let sortedTournaments = [...tournaments].sort(
        (a, b) =>
          Number(a["@scheduledStartDate"] ?? 0) -
          Number(b["@scheduledStartDate"] ?? 0)
      );

      const results: tableCellModel[] = [];

      const CHUNK_SIZE = 200; // пауза каждые 200 итераций
      const PAUSE_MS = 1000; // 1 сек
      const PROGRESS_STEP = 50; // обновлять прогресс реже

      const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
      let _lastProgress = 0;
      const total = sortedTournaments.length;

      // Простой синхронный цикл вместо рекурсии
      for (
        let currentIndex = 0;
        currentIndex < sortedTournaments.length;
        currentIndex++
      ) {
        if (
          currentIndex - _lastProgress >= PROGRESS_STEP ||
          currentIndex + 1 === total
        ) {
          _lastProgress = currentIndex;
          setProcessedCount(currentIndex + 1);
        }
        if ((currentIndex + 1) % CHUNK_SIZE === 0) {
          if (typeof requestIdleCallback === "function") {
            await new Promise<void>((r) =>
              (requestIdleCallback as any)(() => r(), { timeout: PAUSE_MS })
            );
          } else {
            await new Promise((r) => setTimeout(r, PAUSE_MS));
          }

          if (performance && (performance as any).memory) {
            const m = (performance as any).memory.usedJSHeapSize / 1048576;
            console.log(
              `[stage1] heap ~${m.toFixed(1)} MB @ ${currentIndex + 1}/${total}`
            );
          }
        }
        const tournament = sortedTournaments[currentIndex];

        const network = getNetwork(tournament["@network"]);
        const validatedName = validateName(tournament["@name"], stopWords);
        const stake = Number(tournament["@stake"] ?? 0);
        const rake = Number(tournament["@rake"] ?? 0);
        const bid = (stake + rake).toFixed(2);
        const isStartDate = tournament["@scheduledStartDate"] ?? 0;
        const isRegDate = tournament["@lateRegEndDate"] ?? 0;
        const startDate = Number(isStartDate) * 1000 + Number(timezone);
        const regDate = Number(isRegDate) * 1000 + Number(timezone);
        const time = getTimeByMS(Number(`${isStartDate}000`));
        const bounty = isNormal(tournament);
        const mystery = isMystery(tournament);
        const turbo = isTurbo(tournament);
        const superturbo = isSuperTurbo(tournament);
        const status = getStatus(tournament);
        const currency = tournament["@currency"];
        const od = tournament["@flags"]?.includes("OD");
        const { level: networksLevel = 1, effmu = "A" } =
          networks?.[mystery ? "mystery" : bounty ? "ko" : "freezout"]?.[
            network
          ] ?? {};
        const level = networksLevel + effmu;
        const sng = tournament["@gameClass"]?.includes("sng");
        const isNL = tournament["@structure"] === "NL";
        const isH = tournament["@game"] === "H";
        const rebuy = isRebuy(tournament);
        const isMandatoryСonditions = isNL && isH && !rebuy && !od && !sng;

        const info = findTournamentWithDiapzone(
          score1?.[network]?.[getWeekday(Number(isStartDate) * 1000)]?.[
            String(stake.toFixed(2))
          ]?.[validatedName],
          `${time}:00`
        );

        const score = (isMandatoryСonditions && info?.["score"]) || "-";
        const duration =
          info?.["duration"] !== "NaN:NaN:NaN" ? info?.["duration"] : "-";

        const evscore =
          evScore?.[status]?.[Math.round(Number(stake) + Number(rake))] || 0;
        const sat = isSat(tournament);

        if (network === "WPN" || network === "888" || network === "Chico") {
          const $ = tournament["@name"].split("$");
          if ($.length > 1) {
            if (network === "Chico" && !sat) {
              if (typeof +$[1][0] === "number") {
                tournament["@guarantee"] = $[1]
                  ?.split(" ")[0]
                  ?.replace(")", "")
                  ?.replace(",", "")
                  ?.replace(",", "")
                  ?.replace(",", "");
              } else {
                tournament["@guarantee"] = $[2]
                  ?.split(" ")?.[0]
                  ?.replace(",", "")
                  ?.replace(",", "")
                  ?.replace(",", "")
                  ?.replace(".5K", "500")
                  ?.replace("K", "000")
                  ?.replace("M", "000000")
                  ?.replace(".", "")
                  ?.replace(".", "")
                  ?.replace(".", "");
              }
            } else if ((network === "WPN" && !sat) || network === "888") {
              tournament["@guarantee"] = $[1]
                ?.split(" ")[0]
                ?.replace(")", "")
                ?.replace(",", "")
                ?.replace(",", "")
                ?.replace(",", "");
            }
          }
        }

        const prizepool = Math.round(
          Math.max(
            Number(tournament["@guarantee"] ?? 0),
            Number(tournament["@prizePool"] ?? 0),
            (Number(tournament["@entrants"] ?? 0) +
              Number(tournament["@reEntries"] ?? 0)) *
              Number(tournament["@stake"] ?? 0),
            (Number(tournament["@totalEntrants"] ?? 0) +
              Number(tournament["@reEntries"] ?? 0)) *
              Number(tournament["@stake"] ?? 0)
          )
        );

        const pp = prizepool >= 0 ? prizepool : "-";

        const processedTournament = {
          ...tournament,
          "@date": isStartDate,
          "@bid": bid,
          "@realBid": bid,
          "@turbo": !!turbo,
          "@rebuy": !!rebuy,
          "@od": !!tournament["@flags"]?.includes("OD"),
          "@bounty": !!bounty || !!mystery,
          "@sat": !!sat,
          "@sng": !!tournament["@gameClass"]?.includes("sng"),
          "@deepstack": !!tournament["@flags"]?.includes("D"),
          "@superturbo": !!superturbo,
          "@prizepool": pp,
          "@network": network,
          "@score": score,
          "@evscore": evscore,
          "@duration": duration ? getTimeBySec(duration) : "-",
          "@getWeekday": isStartDate
            ? getWeekday(Number(isStartDate) * 1000)
            : "-",
          "@scheduledStartDate": isStartDate ? getDate(startDate) : "-",
          "@lateRegEndDate": isRegDate ? getDate(regDate) : "-",
          "@numberLateRegEndDate": regDate,
          "@timezone": timezone,
          "@status": status,
          "@level": level,
          "@usdBid":
            currency === "CNY"
              ? Math.round(Number(bid) / lastValue)
              : Number(bid),
          "@usdPrizepool":
            currency === "CNY" && pp !== "-" ? pp / lastValue : pp,
          "@msStartForRule": isStartDate
            ? timeStringToMilliseconds(
                dateToTimeString(Number(isStartDate) * 1000)
              )
            : "-",
        };

        // const data = filter(
        //   level,
        //   offpeak,
        //   processedTournament,
        //   config?.alias,
        //   true
        // );

        let {
          valid = true,
          color: rColor = "unknown",
          ruleString = "unknown (score rule?)",
        } = {}

        const { score: score2, color: sColor = "unknown" } = scores(
          level,
          processedTournament,
          config?.alias
        );

        if (score !== "-" && score2 !== null && score <= score2) {
          valid = true;
        }

        const color = getColorByScore(
          score,
          processedTournament["@evscore"],
          colors,
          isLight
        );

        const result = {
          ...processedTournament,
          color,
          valid,
          score2,
          rColor,
          sColor,
        };

        results.push(result);
      }

      const processedTournaments = results;

      setCurrentStage(2);
      setProcessedCount(0);
      setTotalCount(processedTournaments.length);
      const filteredResults: tableCellModel[] = [];

      // Простой синхронный цикл для стадии 2
      for (
        let currentIndex = 0;
        currentIndex < processedTournaments.length;
        currentIndex++
      ) {
        setProcessedCount(currentIndex + 1);

        const tournament = processedTournaments[currentIndex];
        const bounty = tournament["@bounty"];
        const turbo = tournament["@turbo"];
        const superturbo = tournament["@superturbo"];
        const prizepool = tournament["@usdPrizepool"];

        const isValid =
          Number(tournament["@usdBid"]) >= Number(moneyStart) &&
          Number(tournament["@usdBid"]) <= Number(moneyEnd) &&
          ((isKOQ !== false && isNormalQ !== false
            ? bounty && !turbo && !superturbo
            : false) ||
            (isKOQ !== false && isTurboQ !== false ? bounty && turbo : false) ||
            (isKOQ !== false && isSTurboQ !== false
              ? bounty && superturbo
              : false) ||
            (isFreezoutQ !== false && isNormalQ !== false
              ? !bounty && !turbo && !superturbo
              : false) ||
            (isFreezoutQ !== false && isTurboQ !== false
              ? !bounty && turbo
              : false) ||
            (isFreezoutQ !== false && isSTurboQ !== false
              ? !bounty && superturbo
              : false)) &&
          (prizepool !== "-"
            ? Number(prizepoolStart) <= Number(prizepool) &&
              Number(prizepool) <= Number(prizepoolEnd)
            : true);

        if (isValid) {
          filteredResults.push(tournament);
        }
      }

      const filteredTournaments = filteredResults;

      setCurrentStage(3);
      setProcessedCount(0);
      setTotalCount(filteredTournaments.length);
      const timeFilteredResults: tableCellModel[] = [];

      // Простой синхронный цикл для стадии 3
      for (
        let currentIndex = 0;
        currentIndex < filteredTournaments.length;
        currentIndex++
      ) {
        setProcessedCount(currentIndex + 1);

        const item = filteredTournaments[currentIndex];
        const startDate = item?.["@scheduledStartDate"] ?? "-";

        if (!item.valid) {
          continue;
        }

        if (startDate === "-") {
          timeFilteredResults.push(item);
          continue;
        }

        const res = startDate?.split(", ")?.[1]?.split(":")?.[0];
        const r = dateEnd === "00" && dateStart <= dateEnd ? "24" : dateEnd;

        const isValid =
          dateStart <= dateEnd
            ? dateStart <= res && res <= r
            : !(dateStart > res && res > dateEnd);

        if (isValid) {
          timeFilteredResults.push(item);
        }
      }

      const timeFilteredTournaments = timeFilteredResults;

      setCurrentStage(4);
      setProcessedCount(0);
      setTotalCount(timeFilteredTournaments.length);
      const finalFilteredResults: tableCellModel[] = [];

      // Простой синхронный цикл для стадии 4
      for (
        let currentIndex = 0;
        currentIndex < timeFilteredTournaments.length;
        currentIndex++
      ) {
        setProcessedCount(
          results.length +
            filteredResults.length +
            timeFilteredResults.length +
            currentIndex +
            1
        );

        const item = timeFilteredTournaments[currentIndex];
        const duration = item?.["@duration"];
        const { time1, time2, normalTime, turboTime, superTurboTime } =
          config ?? {};
        const startDate =
          item?.["@scheduledStartDate"] !== "-"
            ? item?.["@scheduledStartDate"]
            : item?.["@lateRegEndDate"] ?? "-";
        const regDate =
          item?.["@lateRegEndDate"] !== "-"
            ? item?.["@lateRegEndDate"]
            : item?.["@scheduledStartDate"] ?? "-";
        const turbo = item?.["@turbo"];
        const superturbo = item?.["@superturbo"];
        const normal = !turbo && !superturbo;

        if (
          startDate === "-" ||
          (startDate === "-" && (!duration || duration === "-")) ||
          !time1 ||
          !time2
        ) {
          finalFilteredResults.push(item);
          continue;
        }

        const now = startDate?.split(", ")?.[1];
        const reg = regDate?.split(", ")?.[1];
        const sDate = item?.["@scheduledStartDate"]?.split(", ")?.[1];
        const rDate = item?.["@lateRegEndDate"]?.split(", ")?.[1];

        const res = addTime(
          now,
          !duration || duration === "-" ? "00:00" : duration
        );
        const r = time2 === "00:00" && time1 <= time2 ? "24:00" : time2;

        if (normal && normalTime) {
          const normalEndTime = addTime(time1, normalTime);
          const r =
            normalEndTime === "00:00" && time1 <= normalEndTime
              ? "24:00"
              : normalEndTime;

          const isStartDateFull =
            time1 <= normalEndTime
              ? time1 <= sDate && sDate <= r
              : !(time1 > sDate && sDate > normalEndTime);
          const isRegDateFull =
            time1 <= normalEndTime
              ? time1 <= rDate && rDate <= r
              : !(time1 > rDate && rDate > normalEndTime);

          if (
            !(
              (sDate !== "-" && isStartDateFull) ||
              (rDate !== "-" && isRegDateFull)
            )
          ) {
            continue;
          }
        }

        if (turbo && turboTime) {
          const turboEndTime = addTime(time1, turboTime);
          const r =
            turboEndTime === "00:00" && time1 <= turboEndTime
              ? "24:00"
              : turboEndTime;

          const isStartDateFull =
            time1 <= turboEndTime
              ? time1 <= sDate && sDate <= r
              : !(time1 > sDate && sDate > turboEndTime);
          const isRegDateFull =
            time1 <= turboEndTime
              ? time1 <= rDate && rDate <= r
              : !(time1 > rDate && rDate > turboEndTime);

          if (
            !(
              (sDate !== "-" && isStartDateFull) ||
              (rDate !== "-" && isRegDateFull)
            )
          ) {
            continue;
          }
        }

        if (superturbo && superTurboTime) {
          const stEndTime = addTime(time1, superTurboTime);
          const r =
            stEndTime === "00:00" && time1 <= stEndTime ? "24:00" : stEndTime;

          const isStartDateFull =
            time1 <= stEndTime
              ? time1 <= sDate && sDate <= r
              : !(time1 > sDate && sDate > stEndTime);
          const isRegDateFull =
            time1 <= stEndTime
              ? time1 <= rDate && rDate <= r
              : !(time1 > rDate && rDate > stEndTime);

          if (
            !(
              (sDate !== "-" && isStartDateFull) ||
              (rDate !== "-" && isRegDateFull)
            )
          ) {
            continue;
          }
        }

        const isValid =
          time1 <= time2
            ? time1 <= res && res <= r
            : !(time1 > res && res > time2);

        if (isValid) {
          finalFilteredResults.push(item);
        }
      }

      const finalFilteredTournaments = finalFilteredResults;

      const ignoredKeys = ["@id", "@lastUpdateTime"];

      // Оптимизированная функция определения дубликатов
      const areObjectsEqual = (obj1: tableCellModel, obj2: tableCellModel) => {
        // Сравниваем только ключевые поля вместо всего объекта
        const keyFields = [
          "@name",
          "@network",
          "@stake",
          "@rake",
          "@scheduledStartDate",
          "@lateRegEndDate",
          "@entrants",
          "@reEntries",
        ];

        for (const key of keyFields) {
          // @ts-ignore
          if (obj1[key] !== obj2[key]) {
            return false;
          }
        }
        return true;
      };

      // Используем Map для O(N) сложности вместо O(N²)
      const seen = new Map<string, boolean>();
      setCurrentStage(5);
      setProcessedCount(0);
      setTotalCount(finalFilteredTournaments.length);

      const uniqueTournaments = finalFilteredTournaments.filter((item) => {
        // Создаем ключ из ключевых полей
        const key = `${item["@name"]}_${item["@network"]}_${item["@stake"]}_${item["@rake"]}_${item["@scheduledStartDate"]}_${item["@lateRegEndDate"]}`;

        if (seen.has(key)) {
          return false;
        }

        seen.set(key, true);
        return true;
      });

      setProcessing(false);
      return uniqueTournaments;
    } catch (error) {
      setProcessing(false);
      throw error;
    }
  }
);

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
  const {
    tournaments,
    currentTheme,
    tournamentsSettings,
    config,
    filterContent,
    store,
    stopWords,
    colors,
  } = params;

  if (!tournaments || tournaments.length === 0) {
    clearAsyncFilteredState();
    return;
  }

  clearAsyncFilteredState();
  setProcessedCount(0);
  setTotalCount(0);
  setCurrentStage(1);

  processTableDataAsync({
    tournaments,
    currentTheme,
    tournamentsSettings,
    config,
    filterContent,
    store,
    stopWords,
    colors,
  });
});
