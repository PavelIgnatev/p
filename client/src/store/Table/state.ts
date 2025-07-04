import { timeStringToMilliseconds } from "./../../helpers/timeStringToMilliseconds";
import { findTournamentWithDiapzone } from "./../../helpers/findTournamentWithDiapzone";
import { createStore, combine } from "effector";
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

// function getStartDate(
//   startDate: string,
//   regEndDate: string,
//   startSession: string
// ) {
//   const hasStartDate = startDate !== "-";
//   const hasRegEndDate = regEndDate !== "-";
//   const hasStartSessionDate = !!startSession;

//   if (hasStartDate && hasRegEndDate && hasStartSessionDate) {
//     // сюда писать
//   }

//   if (hasRegEndDate) {
//     return regEndDate;
//   }

//   if (hasStartDate) {
//     return startDate;
//   }

//   return "-";
// }

export const $filtredTableState = combine(
  $tableState,
  $theme,
  (tournaments, currentTheme) => {
    if (!tournaments) {
      return [];
    }

    const config = $config.getState();
    const { filter, scores } = $filterContent.getState();
    const stopWords = $stopWords.getState();
    const { currency: lastValue, offpeak } = $store.getState();
    const { score1, evscore: evScore }: any = $store.getState();
    const colors = $colors.getState();

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
    } = $tournamentsSettings.getState();
    const { networks, timezone } = config ?? {};

    // сортировка по времени старта турнира
    tournaments = tournaments.sort(
      (a, b) =>
        Number(a["@scheduledStartDate"] ?? 0) -
        Number(b["@scheduledStartDate"] ?? 0)
    );

    // Валидация названия турнира
    const validateName = (name: string, stopWords: string[]) => {
      if (!name) return "";
      else name = name.toLowerCase();

      const cleanedName = name.replace(/[^\w]/gi, "").replace(/\d+/g, "");

      stopWords.forEach((word) => {
        cleanedName.replace(word, "");
      });

      return cleanedName;
    };

    // мапим все данные о турнирах
    tournaments = tournaments.map((tournament) => {
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
      const turbo = isTurbo(tournament);
      const superturbo = isSuperTurbo(tournament);
      const status = getStatus(tournament);
      const currency = tournament["@currency"];
      const od = tournament["@flags"]?.includes("OD");
      const { level: networksLevel = 1, effmu = "A" } =
        networks?.[bounty ? "ko" : "freezout"]?.[network] ?? {};
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

      //Фикс гарантии для WPN и 888Poker и Chiko
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

      return {
        ...tournament,
        "@date": isStartDate,
        "@bid": bid,
        "@realBid": bid,
        "@turbo": !!turbo,
        "@rebuy": !!rebuy,
        "@od": !!tournament["@flags"]?.includes("OD"),
        "@bounty": !!bounty,
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
        "@usdPrizepool": currency === "CNY" && pp !== "-" ? pp / lastValue : pp,
        "@msStartForRule": isStartDate
          ? timeStringToMilliseconds(
              dateToTimeString(Number(isStartDate) * 1000)
            )
          : "-",
      };
    });

    // фильтр по параметрам
    tournaments = tournaments.filter((tournament) => {
      const bounty = tournament["@bounty"];
      const turbo = tournament["@turbo"];
      const superturbo = tournament["@superturbo"];
      const prizepool = tournament["@usdPrizepool"];

      return (
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
          : true)
      );
    });

    // определение цвета турнира
    tournaments = tournaments.map((tournament) => {
      const level = tournament["@level"];
      let data = filter(level, offpeak, tournament, config?.alias, true);
      let {
        valid,
        color: rColor = "unknown",
        ruleString = "unknown (score rule?)",
      } = data;

      const {
        score: score2,
        color: sColor = "unknown",
        ruleString: sRuleString = "unknown",
      } = scores(level, tournament, config?.alias);

      const score = tournament["@score"];

      if (score !== "-" && score2 !== null && score <= score2) {
        valid = true;
      }

      const diff =
        Number(!score || score === "-" ? 100 : score) -
        Number(tournament["@evscore"] || 100);
      const numForGreen = colors?.[1] || 0;
      const numForOrange = colors?.[2] || 0;
      const numForYellow = colors?.[3] || 0;

      const isLight = currentTheme === "light";

      let color = isLight ? "#fd6767" : "#cc5555"; // Красный: ярче для светлой, темнее для темной
      if (-100 <= diff && diff < numForGreen) {
        color = isLight ? "#74ce74" : "#5bb85b"; // Зеленый: ярче для светлой, темнее для темной
      }
      if (numForGreen <= diff && diff < numForOrange) {
        color = isLight ? "yellow" : "#d4af37"; // Желтый: стандартный для светлой, золотой для темной
      }
      if (numForOrange <= diff && diff < numForYellow) {
        color = isLight ? "#ffa90c" : "#cc8a0c"; // Оранжевый: ярче для светлой, темнее для темной
      }
      if (score === "-" || !tournament["@evscore"]) {
        color = isLight ? "rgb(238, 236, 255)" : "rgb(80, 80, 95)"; // Нейтральный: светлый для светлой, темно-серый для темной
      }

      return {
        ...tournament,
        color,
        valid,
        score2,
        rColor,
        sColor,
        ruleString,
        sRuleString,
      };
    });

    // фильтр по времени "от"-"до"
    tournaments = tournaments.filter((item) => {
      const startDate = item?.["@scheduledStartDate"] ?? "-";
      const { dateStart, dateEnd } = $tournamentsSettings.getState();

      if (!item.valid) return false;
      if (startDate === "-") return true;

      const res = startDate?.split(", ")?.[1]?.split(":")?.[0];
      const r = dateEnd === "00" && dateStart <= dateEnd ? "24" : dateEnd;

      return dateStart <= dateEnd
        ? dateStart <= res && res <= r
        : !(dateStart > res && res > dateEnd);
    });

    tournaments = tournaments.filter((item) => {
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
      )
        return true;

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
          return false;
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
          return false;
        }
      }

      if (superturbo && superTurboTime) {
        const superTurboEndTime = addTime(time1, superTurboTime);
        const r =
          superTurboEndTime === "00:00" && time1 <= superTurboEndTime
            ? "24:00"
            : superTurboEndTime;

        const isStartDateFull =
          time1 <= superTurboEndTime
            ? time1 <= sDate && sDate <= r
            : !(time1 > sDate && sDate > superTurboEndTime);
        const isRegDateFull =
          time1 <= superTurboEndTime
            ? time1 <= rDate && rDate <= r
            : !(time1 > rDate && rDate > superTurboEndTime);

        if (
          !(
            (sDate !== "-" && isStartDateFull) ||
            (rDate !== "-" && isRegDateFull)
          )
        ) {
          return false;
        }
      }

      // обязательные поля
      return time1 <= time2
        ? time1 <= res && res <= r && time1 <= reg && reg <= r
        : !((time1 > res && res > time2) || (time1 > reg && reg > time2));
    });

    const ignoredKeys = ["@id", "@lastUpdateTime"];

    const areObjectsEqual = (obj1: tableCellModel, obj2: tableCellModel) => {
      const filteredObj1 = Object.fromEntries(
        Object.entries(obj1).filter(([key]) => !ignoredKeys.includes(key))
      );

      const filteredObj2 = Object.fromEntries(
        Object.entries(obj2).filter(([key]) => !ignoredKeys.includes(key))
      );

      return JSON.stringify(filteredObj1) === JSON.stringify(filteredObj2);
    };

    tournaments = tournaments.filter(
      (item, index, self) =>
        self.findIndex((otherItem) => areObjectsEqual(item, otherItem)) ===
        index
    );

    return tournaments;
  }
);
