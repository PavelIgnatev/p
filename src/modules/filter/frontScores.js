'use strict';

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

/**
 * Возвращает сокращенное название network из полного
 * @param {string} network network
 * @return {string} Сокращенное название network
 */

var getNetwork_1;
var hasRequiredGetNetwork;

function requireGetNetwork () {
	if (hasRequiredGetNetwork) return getNetwork_1;
	hasRequiredGetNetwork = 1;
	const getNetwork = (network) => {
	  switch (network) {
	    case "PokerStars(FR-ES-PT)": {
	      network = "PS.es";
	      break;
	    }
	    case "PokerStars": {
	      network = "PS.eu";
	      break;
	    }
	    case "PartyPoker": {
	      network = "Party";
	      break;
	    }
	    case "GGNetwork": {
	      network = "GG";
	      break;
	    }
	    case "888Poker": {
	      network = "888";
	      break;
	    }
	    case "Winamax.fr": {
	      network = "WNMX";
	      break;
	    }
	    case "iPoker": {
	      network = "IP";
	      break;
	    }
	    case "Chico": {
	      network = "Chico";
	      break;
	    }
	  }
	  return network;
	};

	getNetwork_1 = { getNetwork };
	return getNetwork_1;
}

var curry_1;
var hasRequiredCurry;

function requireCurry () {
	if (hasRequiredCurry) return curry_1;
	hasRequiredCurry = 1;
	function curry(func) {
	  return function curried(...args) {
	    if (args.length >= func.length) {
	      return func.apply(this, args);
	    } else {
	      return function (...args2) {
	        return curried.apply(this, args.concat(args2));
	      };
	    }
	  };
	}

	// FromTo = FromToQ(bid);
	// FromToName = FromToNameQ(name)(bid);
	// BidGt = BidGtQ(bid)(prizepool);
	// BidGtName = BidGtNameQ(name)(bid)(prizepool);
	// FromToGt = FromToGtQ(bid)(prizepool);
	// Ticket = TicketQ(name)(bid)(tournament["@tickets"] ?? 0);
	// Entrants = EntrantsQ(tournament?.["@totalEntrants"] ?? 0);
	// BidName = BidNameQ(name)(bid);
	// StartDay = StartDayQ(weekDay);
	// Name = NameQ(name);
	// NotName = NotNameQ(name);
	// FLAGS = FLAGSQ(tournament);

	//Ставка больше либо равно и ставка меньше либо равно
	const FromTo = curry(
	  (realBid, from, to) => Number(realBid) >= Number(from) && Number(realBid) <= Number(to),
	);

	//name.includes
	const Name = curry((name, str) => name.toLowerCase().includes(str.toLowerCase()));

	//Score
	const Score = curry((score) => score);

	//Score
	const ScoreEqual = curry((cur, score) => score === cur);
	//Score
	const ScoreFrom = curry((cur, score) => score <= cur);
	//Score
	const ScoreTo = curry((cur, score) => score >= cur);

	const StartRegEqual = curry((startRegMs, equal) => Number(startRegMs) === Number(equal));
	const StartRegFrom = curry((startRegMs, from) => Number(startRegMs) >= Number(from));
	const StartRegTo = curry((startRegMs, to) => Number(startRegMs) <= Number(to));

	const UserName = curry((UserName, equal) => UserName === equal);

	//Ставка больше либо равно и ставка меньше либо равно + name.includes
	const FromToName = curry(
	  (name, realBid, from, to, str) => FromTo(realBid, from, to) && Name(name, str),
	);

	//Ставка равно, гарантия больше либо равно
	const BidGt = curry(
	  (realBid, realPrizepool, bid, prizepool) =>
	    Number(bid) === Number(realBid) && Number(realPrizepool) >= Number(prizepool),
	);

	//Ставка равно, гарантия больше либо равно + name.includes
	const BidGtName = curry(
	  (name, realBid, realPrizepool, bid, prizepool, str) =>
	    BidGt(realBid, realPrizepool, bid, prizepool) && Name(name, str),
	);

	//тик равно, тикеты больше либо равно + name.includes
	const Ticket = curry(
	  (name, realBid, realTickets, bid, tickets, str) =>
	    BidGt(realBid, realTickets, bid, tickets) && Name(name, str),
	);

	//Ставка равно + name.includes
	const BidName = curry(
	  (name, realBid, bid, str) => Number(realBid) === Number(bid) && Name(name, str),
	);

	//!name.includes
	const NotName = curry((name, str) => !Name(name, str));

	//Ставка больше либо равно и ставка меньше либо равно, гарантия больше либо равно
	const FromToGt = curry(
	  (realBid, realPrizepool, from, to, prizepool) =>
	    FromTo(realBid, from, to) && Number(realPrizepool) >= Number(prizepool),
	);

	//Ставка больше либо равно и ставка меньше либо равно, гарантия больше либо равно
	const StartDay = curry((realDay, day) => String(realDay) === String(day));

	// Фильтр по флагу
	const FLAGS = curry((tournament, flags) => {
	  const isNotRule = flags?.includes("!");
	  const rule = tournament?.[`@${flags.replace("!", "")}`] ?? false;
	  

	  return isNotRule ? !rule : rule;
	});

	// Фильтр по Entrants
	const Entrants = curry((totalEntrants, entrants) => Number(totalEntrants) >= Number(entrants));

	curry_1 = {
	  curry,
	  FromTo,
	  FromToName,
	  BidGt,
	  Score,
	  BidGtName,
	  Ticket,
	  BidName,
	  Name,
	  FromToGt,
	  StartDay,
	  Entrants,
	  FLAGS,
	  NotName,
	  ScoreEqual,
	  ScoreFrom,
	  ScoreTo,
	  StartRegEqual,
	  UserName,
	  StartRegFrom,
	  StartRegTo,
	};
	return curry_1;
}

/**
 * Возвращае true, если турнир является super turbo
 * @param {Object} tournament Экземпляр объекта tournament
 * @return {boolean} True, если турнир является super turbo
 */

var isSuperTurbo_1;
var hasRequiredIsSuperTurbo;

function requireIsSuperTurbo () {
	if (hasRequiredIsSuperTurbo) return isSuperTurbo_1;
	hasRequiredIsSuperTurbo = 1;
	const isSuperTurbo = (tournament) => {
	  const name = (tournament["@name"] ?? "").toLowerCase();
	  const superturbo = tournament["@flags"]?.includes("ST") || name?.includes("hyper");

	  return superturbo;
	};

	isSuperTurbo_1 = { isSuperTurbo };
	return isSuperTurbo_1;
}

/**
 * Возвращае true, если турнир является satellite
 * @param {Object} tournament Экземпляр объекта tournament
 * @return {boolean} True, если турнир является super turbo
 */

var IsSat;
var hasRequiredIsSat;

function requireIsSat () {
	if (hasRequiredIsSat) return IsSat;
	hasRequiredIsSat = 1;
	const { getNetwork } = requireGetNetwork();

	const isSat = (tournament) => {
	  const name = tournament["@name"]?.toLowerCase();
	  const network = getNetwork(tournament["@network"]);
	  let sat = network !== "WNMX" ? !!tournament["@flags"]?.includes("SAT") : false;

	  if (!sat && name) {
	    if (network === "GG") {
	      sat =
	        name.includes(" seats") ||
	        name.includes("seats ") ||
	        name.includes(" seat") ||
	        name.includes("seat ") ||
	        name.includes(" qualifier") ||
	        name.includes("qualifier ") ||
	        name.includes(" step") ||
	        name.includes("step ") ||
	        (name.includes(" sat") && !name.includes(" satu")) ||
	        name.includes("sat  ");
	    } else if (network === "WNMX") {
	      sat =
	        (name.includes(" sat") && !name.includes(" satu")) ||
	        name.includes("sat  ") ||
	        name.includes("satellite") ||
	        name.includes("qualif") ||
	        name.includes("last chance") ||
	        name.includes("hit&run");
	    } else if (network === "WPN") {
	      sat =
	        (name.includes(" sat") && !name.includes(" satu")) ||
	        name.includes("sat  ") ||
	        name.includes("satellite") ||
	        name.includes("ticket") ||
	        name.includes("seat") ||
	        name.includes(" qualifier") ||
	        name.includes("qualifier ");
	    } else if (network === "IP") {
	      sat =
	        name.includes("ticket") ||
	        name.includes("ticket") ||
	        name.includes(" seats") ||
	        name.includes("seats ") ||
	        (name.includes(" sat") && !name.includes(" satu")) ||
	        name.includes("sat  ");
	    }
	  }

	  return !!sat;
	};

	IsSat = { isSat };
	return IsSat;
}

var isTurbo_1;
var hasRequiredIsTurbo;

function requireIsTurbo () {
	if (hasRequiredIsTurbo) return isTurbo_1;
	hasRequiredIsTurbo = 1;
	const { getNetwork } = requireGetNetwork();
	const { isSat } = requireIsSat();
	const { isSuperTurbo } = requireIsSuperTurbo();

	/**
	 * Возвращае true, если турнир является turbo
	 * @param {Object} tournament Экземпляр объекта tournament
	 * @return {boolean} True, если турнир является turbo
	 */

	// пока корректно, ждем ответ
	const isTurbo = (tournament) => {
	  let flags = tournament["@flags"];
	  const name = (tournament["@name"] ?? "").toLowerCase();
	  const network = getNetwork(tournament["@network"]);
	  const superturbo = isSuperTurbo(tournament);
	  const sat = isSat(tournament);
	  if ((sat && flags) || flags?.includes("SAT")) flags = flags.replace("SAT", "");

	  const turbo =
	    (flags?.includes("T") ||
	      name?.includes("turbo") ||
	      (network === "PS.eu" && name?.includes("hot"))) &&
	    !superturbo;

	  return turbo;
	};

	isTurbo_1 = { isTurbo };
	return isTurbo_1;
}

/**
 * Возвращае true, если турнир является normal
 * @param {Object} tournament Экземпляр объекта tournament
 * @return {boolean} True, если турнир является normal
 */

var isNormal_1;
var hasRequiredIsNormal;

function requireIsNormal () {
	if (hasRequiredIsNormal) return isNormal_1;
	hasRequiredIsNormal = 1;
	const isNormal = (tournament) => {
	  const name = (tournament["@name"] ?? "").toLowerCase();

	  return !!(
	    (tournament["@flags"]?.includes("B") || name?.includes("bounty")) &&
	    !name?.includes("myster")
	  );
	};

	isNormal_1 = { isNormal };
	return isNormal_1;
}

var validateNumber_1;
var hasRequiredValidateNumber;

function requireValidateNumber () {
	if (hasRequiredValidateNumber) return validateNumber_1;
	hasRequiredValidateNumber = 1;
	const validateNumber = (value) => {
	  return value
	    .replace(/[^\d.]*/g, "")
	    .replace(/([.])[.]+/g, "$1")
	    .replace(/^[^\d]*(\d+([.]\d{0,5})?).*$/g, "$1");
	};
	validateNumber_1 = { validateNumber };
	return validateNumber_1;
}

var scores_1;
var hasRequiredScores;

function requireScores () {
	if (hasRequiredScores) return scores_1;
	hasRequiredScores = 1;
	const { getNetwork } = requireGetNetwork();
	  const {
	    FromTo: FromToQ,
	    FromToName: FromToNameQ,
	    BidGt: BidGtQ,
	    BidGtName: BidGtNameQ,
	    Ticket: TicketQ,
	    BidName: BidNameQ,
	    Name: NameQ,
	    Score: ScoreQ,
	    StartRegEqual: StartRegEqualQ,
	    StartRegFrom: StartRegFromQ,
	    StartRegTo: StartRegToQ,
	    UserName: UserNameQ,
	    FromToGt: FromToGtQ,
	    StartDay: StartDayQ,
	    NotName: NotNameQ,
	    Entrants: EntrantsQ,
	    FLAGS: FLAGSQ,
	  } = requireCurry();
	  const { isSuperTurbo: isSuperTurboS } = requireIsSuperTurbo();
	  const { isTurbo: isTurboS } = requireIsTurbo();
	  const { isNormal: isNormalS } = requireIsNormal();
	  const {validateNumber} = requireValidateNumber();
	  
	  const scores = (scoreLevel, tournament, alias) => {
	    const name = tournament["@name"]?.toLowerCase(),
	      network = getNetwork(tournament["@network"]),
	      bid = Number(tournament["@usdBid"]),
	      prizepool = Math.round(Number(tournament["@usdPrizepool"])),
	      weekDay = tournament["@getWeekday"],
	      FromTo = FromToQ(bid);
	      FromToNameQ(name)(bid);
	      BidGtQ(bid)(prizepool);
	      BidGtNameQ(name)(bid)(prizepool);
	      FromToGtQ(bid)(prizepool);
	      TicketQ(name)(bid)(tournament["@tickets"] ?? 0);
	      EntrantsQ(tournament?.["@totalEntrants"] ?? 0);
	      const BidName = BidNameQ(name)(bid),
	      StartDay = StartDayQ(weekDay),
	      Name = NameQ(name);
	      StartRegEqualQ(tournament["@msStartForRule"]);
	      StartRegFromQ(tournament["@msStartForRule"]);
	      StartRegToQ(tournament["@msStartForRule"]);
	      UserNameQ(alias);
	      const NotName = NotNameQ(name),
	      FLAGS = FLAGSQ(tournament);

	    const isTurbo = isTurboS(tournament);
	    const isSuperTurbo = isSuperTurboS(tournament);
	    const isKo = isNormalS(tournament);
	    const isNormal = !isTurbo && !isSuperTurbo;

	    const level = (scoreLevel[0] === 'A' || scoreLevel[0] === 'B')? scoreLevel[0] : validateNumber(scoreLevel);
	    const effmu = scoreLevel.replace(level, "").replace("-", "");
	  
	    if (!name || !bid) return { score: null };


	    if((BidName(500,"Day 1"))&& network === 'GG'&& level === '15'&& isNormal) {
	    return {
	      score: 83,
	      color: "green"
	    };
	  }	if((BidName(500,"Day 1"))&& network === 'GG'&& level === '14'&& isNormal) {
	    return {
	      score: 81,
	      color: "green"
	    };
	  }	if((BidName(500,"Day 1"))&& network === 'GG'&& level === '13'&& isNormal) {
	    return {
	      score: 80,
	      color: "green"
	    };
	  }	if((BidName(500,"Day 1"))&& network === 'GG'&& level === '12'&& isNormal) {
	    return {
	      score: 79.5,
	      color: "green"
	    };
	  }	if((BidName(500,"Day 1"))&& network === 'GG'&& level === '11'&& isNormal) {
	    return {
	      score: 79.5,
	      color: "green"
	    };
	  }	if((Name("Zodiac MILLION$ Mystery"))&& network === 'GG'&& level === '4'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 68,
	      color: "green"
	    };
	  }	if((Name("278H"))&& network === 'WPN'&& level === '13'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 81,
	      color: "green"
	    };
	  }	if((Name("278H"))&& network === 'WPN'&& level === '14'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 82,
	      color: "green"
	    };
	  }	if((Name("278H"))&& network === 'WPN'&& level === '14'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 84,
	      color: "green"
	    };
	  }	if((Name("278H"))&& network === 'WPN'&& level === '15'&& isNormal) {
	    return {
	      score: 85,
	      color: "green"
	    };
	  }	if((Name("278M"))&& network === 'WPN'&& level === '15'&& isNormal) {
	    return {
	      score: 84,
	      color: "green"
	    };
	  }	if((Name("278M"))&& network === 'WPN'&& level === '14'&& isNormal) {
	    return {
	      score: 84,
	      color: "green"
	    };
	  }	if((Name("278M"))&& network === 'WPN'&& level === '13'&& isNormal) {
	    return {
	      score: 82,
	      color: "green"
	    };
	  }	if((Name("278M"))&& network === 'WPN'&& level === '12'&& isNormal) {
	    return {
	      score: 80,
	      color: "green"
	    };
	  }	if((Name("278M"))&& network === 'WPN'&& level === '11'&& isNormal) {
	    return {
	      score: 79,
	      color: "green"
	    };
	  }	if((Name("278M"))&& network === 'WPN'&& level === '10'&& isNormal) {
	    return {
	      score: 76,
	      color: "green"
	    };
	  }	if((Name("278L"))&& network === 'WPN'&& level === '15'&& isNormal) {
	    return {
	      score: 78,
	      color: "green"
	    };
	  }	if((Name("278L"))&& network === 'WPN'&& level === '14'&& isNormal) {
	    return {
	      score: 78,
	      color: "green"
	    };
	  }	if((Name("278L"))&& network === 'WPN'&& level === '13'&& isNormal) {
	    return {
	      score: 77,
	      color: "green"
	    };
	  }	if((Name("278L"))&& network === 'WPN'&& level === '12'&& isNormal) {
	    return {
	      score: 75,
	      color: "green"
	    };
	  }	if((Name("278L"))&& network === 'WPN'&& level === '11'&& isNormal) {
	    return {
	      score: 75,
	      color: "green"
	    };
	  }	if((Name("278L"))&& network === 'WPN'&& level === '10'&& isNormal) {
	    return {
	      score: 75,
	      color: "green"
	    };
	  }	if((Name("278L"))&& network === 'WPN'&& level === '9'&& isNormal) {
	    return {
	      score: 74,
	      color: "green"
	    };
	  }	if((Name("278L"))&& network === 'WPN'&& level === '8'&& isNormal) {
	    return {
	      score: 73,
	      color: "green"
	    };
	  }	if((Name("278L"))&& network === 'WPN'&& level === '7'&& isNormal) {
	    return {
	      score: 72,
	      color: "green"
	    };
	  }	if((Name("278L"))&& network === 'WPN'&& level === '6'&& isNormal) {
	    return {
	      score: 71,
	      color: "green"
	    };
	  }	if((Name("278L"))&& network === 'WPN'&& level === '5'&& isNormal) {
	    return {
	      score: 71,
	      color: "green"
	    };
	  }	if((Name("278L"))&& network === 'WPN'&& level === '4'&& isNormal) {
	    return {
	      score: 70,
	      color: "green"
	    };
	  }	if((Name("278L"))&& network === 'WPN'&& level === '3'&& isNormal) {
	    return {
	      score: 70,
	      color: "green"
	    };
	  }	if((Name("278L"))&& network === 'WPN'&& level === '2'&& isNormal) {
	    return {
	      score: 68,
	      color: "green"
	    };
	  }	if((Name("278L"))&& network === 'WPN'&& level === '1'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 66,
	      color: "green"
	    };
	  }	if((NotName("London"))&& network === 'GG'&& level === '15'&& isNormal && (BidName(50,"Day 1"))&& network === 'GG'&& level === '15'&& isNormal) {
	    return {
	      score: 75,
	      color: "green"
	    };
	  }	if((NotName("London"))&& network === 'GG'&& level === '14'&& isNormal && (BidName(50,"Day 1"))&& network === 'GG'&& level === '14'&& isNormal) {
	    return {
	      score: 75,
	      color: "green"
	    };
	  }	if((NotName("London"))&& network === 'GG'&& level === '13'&& isNormal && (BidName(50,"Day 1"))&& network === 'GG'&& level === '13'&& isNormal) {
	    return {
	      score: 74,
	      color: "green"
	    };
	  }	if((NotName("London"))&& network === 'GG'&& level === '12'&& isNormal && (BidName(50,"Day 1"))&& network === 'GG'&& level === '12'&& isNormal) {
	    return {
	      score: 74,
	      color: "green"
	    };
	  }	if((NotName("London"))&& network === 'GG'&& level === '11'&& isNormal && (BidName(50,"Day 1"))&& network === 'GG'&& level === '11'&& isNormal) {
	    return {
	      score: 73,
	      color: "green"
	    };
	  }	if((NotName("London"))&& network === 'GG'&& level === '10'&& isNormal && (BidName(50,"Day 1"))&& network === 'GG'&& level === '10'&& isNormal) {
	    return {
	      score: 72,
	      color: "green"
	    };
	  }	if((NotName("London"))&& network === 'GG'&& level === '9'&& isNormal && (BidName(50,"Day 1"))&& network === 'GG'&& level === '9'&& isNormal) {
	    return {
	      score: 70,
	      color: "green"
	    };
	  }	if((NotName("London"))&& network === 'GG'&& level === '8'&& isNormal && (BidName(50,"Day 1"))&& network === 'GG'&& level === '8'&& isNormal) {
	    return {
	      score: 69,
	      color: "green"
	    };
	  }	if((NotName("London"))&& network === 'GG'&& level === '7'&& isNormal && (BidName(50,"Day 1"))&& network === 'GG'&& level === '7'&& isNormal) {
	    return {
	      score: 68,
	      color: "green"
	    };
	  }	if((NotName("London"))&& network === 'GG'&& level === '6'&& isNormal && (BidName(50,"Day 1"))&& network === 'GG'&& level === '6'&& isNormal) {
	    return {
	      score: 67,
	      color: "green"
	    };
	  }	if((NotName("London"))&& network === 'GG'&& level === '5'&& isNormal && (BidName(50,"Day 1"))&& network === 'GG'&& level === '5'&& isNormal) {
	    return {
	      score: 66,
	      color: "green"
	    };
	  }	if((NotName("London"))&& network === 'GG'&& level === '4'&& isNormal && (BidName(50,"Day 1"))&& network === 'GG'&& level === '4'&& isNormal) {
	    return {
	      score: 63,
	      color: "green"
	    };
	  }	if((NotName("London"))&& network === 'GG'&& level === '3'&& isNormal && (BidName(50,"Day 1"))&& network === 'GG'&& level === '3'&& isNormal) {
	    return {
	      score: 61,
	      color: "green"
	    };
	  }	if((Name("Adrenaline"))&& network === 'PS.eu') {
	    return { score: null };
	  }	if((Name("step"))&& network === 'PS.eu') {
	    return { score: null };
	  }	if((Name("10 BB"))&& network === 'PS.eu') {
	    return { score: null };
	  }	if((Name("10BB"))&& network === 'PS.eu') {
	    return { score: null };
	  }	if((Name("20 BB"))&& network === 'PS.eu') {
	    return { score: null };
	  }	if((Name("20BB"))&& network === 'PS.eu') {
	    return { score: null };
	  }	if((Name("10BB"))&& network === 'GG') {
	    return { score: null };
	  }	if((Name("10 BB"))&& network === 'GG') {
	    return { score: null };
	  }	if((Name("Phase 2"))&& network === 'Party') {
	    return { score: null };
	  }	if((Name("Phase 3"))&& network === 'Party') {
	    return { score: null };
	  }	if((Name("Satellite"))&& network === 'PS.eu') {
	    return { score: null };
	  }	if((Name("Satellite"))&& network === 'GG') {
	    return { score: null };
	  }	if((Name("Satellite"))&& network === 'IP') {
	    return { score: null };
	  }	if((Name("Satellite"))&& network === 'Chico') {
	    return { score: null };
	  }	if((Name("Satellite"))&& network === 'PS.es') {
	    return { score: null };
	  }	if((Name("Satellite"))&& network === 'Party') {
	    return { score: null };
	  }	if((Name("Satellite"))&& network === '888') {
	    return { score: null };
	  }	if((Name("Satellite"))&& network === 'WNMX') {
	    return { score: null };
	  }	if((Name("Satellite"))&& network === 'WPN') {
	    return { score: null };
	  }	if((Name("Qualif"))&& network === 'PS.eu') {
	    return { score: null };
	  }	if((Name("Qualif"))&& network === 'IP') {
	    return { score: null };
	  }	if((Name("Qualif"))&& network === 'Chico') {
	    return { score: null };
	  }	if((Name("Qualif"))&& network === 'PS.es') {
	    return { score: null };
	  }	if((Name("Qualif"))&& network === 'Party') {
	    return { score: null };
	  }	if((Name("Qualif"))&& network === 'GG') {
	    return { score: null };
	  }	if((Name("Qualif"))&& network === '888') {
	    return { score: null };
	  }	if((Name("Qualif"))&& network === 'WNMX') {
	    return { score: null };
	  }	if((Name("Qualif"))&& network === 'WPN') {
	    return { score: null };
	  }	if((Name("Trident"))&& network === 'WNMX') {
	    return { score: null };
	  }	if((Name("heads-up"))&& network === 'PS.eu') {
	    return { score: null };
	  }	if((Name("heads-up"))&& network === 'GG') {
	    return { score: null };
	  }	if((Name("heads-up"))&& network === 'Party') {
	    return { score: null };
	  }	if((Name("heads-up"))&& network === '888') {
	    return { score: null };
	  }	if((Name("heads-up"))&& network === 'PS.es') {
	    return { score: null };
	  }	if((Name("heads-up"))&& network === 'WPN') {
	    return { score: null };
	  }	if((Name("deep sat"))&& network === 'WNMX') {
	    return { score: null };
	  }	if((Name("Déglingos"))&& network === 'WNMX') {
	    return { score: null };
	  }	if((Name("T$ Builder"))&& network === 'WNMX') {
	    return { score: null };
	  }	if((Name("T$ Builder"))&& network === 'GG') {
	    return { score: null };
	  }	if((Name("T$ Builder"))&& network === 'PS.eu') {
	    return { score: null };
	  }	if((Name("T$ Builder"))&& network === 'PS.es') {
	    return { score: null };
	  }	if((Name("sat phase"))&& network === 'Party') {
	    return { score: null };
	  }	if((Name("phase 1 sat"))&& network === 'PS.eu') {
	    return { score: null };
	  }	if((Name("phase 1 sat"))&& network === 'PS.es') {
	    return { score: null };
	  }	if((Name("minutes"))&& network === 'PS.es') {
	    return { score: null };
	  }	if((Name("minutes"))&& network === 'PS.eu') {
	    return { score: null };
	  }	if((Name("minutes"))&& network === 'GG') {
	    return { score: null };
	  }	if((Name("minutes"))&& network === 'WPN') {
	    return { score: null };
	  }	if((Name("tickets"))&& network === 'GG') {
	    return { score: null };
	  }	if((Name("phase 1"))&& network === 'Party') {
	    return { score: null };
	  }	if((Name("step"))&& network === 'GG') {
	    return { score: null };
	  }	if((Name("step"))&& network === 'PS.es') {
	    return { score: null };
	  }	if((Name("Heads"))&& network === 'PS.eu') {
	    return { score: null };
	  }	if((Name("package"))&& network === 'Party') {
	    return { score: null };
	  }	if((Name("package"))&& network === 'PS.es') {
	    return { score: null };
	  }	if((Name("package"))&& network === 'PS.eu') {
	    return { score: null };
	  }	if((Name("package"))&& network === 'GG') {
	    return { score: null };
	  }	if((Name("package"))&& network === '888') {
	    return { score: null };
	  }	if((Name("package"))&& network === 'WNMX') {
	    return { score: null };
	  }	if((Name("package"))&& network === 'WPN') {
	    return { score: null };
	  }	if((Name("flight"))&& network === 'WPN') {
	    return { score: null };
	  }	if((Name("glingos"))&& network === 'WNMX') {
	    return { score: null };
	  }	if((Name("stage 1"))&& network === 'GG') {
	    return { score: null };
	  }	if((Name("Phase 1"))&& network === 'PS.eu') {
	    return { score: null };
	  }	if((Name("Phase 2"))&& network === 'PS.eu') {
	    return { score: null };
	  }	if((Name("Stage"))&& network === 'GG') {
	    return { score: null };
	  }	if((FLAGS("rebuy"))) {
	    return { score: null };
	  }	if((FLAGS("od"))) {
	    return { score: null };
	  }	if((FLAGS("sng"))) {
	    return { score: null };
	  }	if((FLAGS("sat"))) {
	    return { score: null };
	  }	if((Name("Mega to"))) {
	    return { score: null };
	  }	if((Name("[10 bb]"))) {
	    return { score: null };
	  }	if((Name("Flip & Go"))) {
	    return { score: null };
	  }	if((Name("Flipout"))) {
	    return { score: null };
	  }	if((BidName(50,"[Final]"))) {
	    return { score: null };
	  }	if((Name("Zodiac MILLION$ [Final Stage]"))) {
	    return { score: null };
	  }	if((BidName(10.5,"[Stage 1]"))) {
	    return { score: null };
	  }	if((Name("$15 Mega to GGMasters Overlay Edition"))) {
	    return { score: null };
	  }	if((Name("Polska Liga Pokera"))) {
	    return { score: null };
	  }	if((Name("POPS - Road to Pokahnights Liège"))) {
	    return { score: null };
	  }	if((Name("SZTOS Rozvadov Final"))) {
	    return { score: null };
	  }	if((Name("Mega to Global MILLION$"))) {
	    return { score: null };
	  }	if((Name("T$ Builder"))) {
	    return { score: null };
	  }	if((Name("tickets"))) {
	    return { score: null };
	  }	if((Name("time"))) {
	    return { score: null };
	  }	if((Name("minutes"))) {
	    return { score: null };
	  }	if((Name("qualif"))) {
	    return { score: null };
	  }	if((Name("heads"))) {
	    return { score: null };
	  }	if((Name("$50 Global MILLION$ World Celebration [Day 1]"))) {
	    return { score: null };
	  }	if((Name("[25 BB]"))) {
	    return { score: null };
	  }	if((Name("1 Ticket"))) {
	    return { score: null };
	  }	if((Name("[20 bb]"))) {
	    return { score: null };
	  }	if((Name("WSOP MAIN EVENT"))) {
	    return { score: null };
	  }	if((Name("London Super"))) {
	    return { score: null };
	  }	if((Name("10BB"))) {
	    return { score: null };
	  }	if((FromTo(120,150))&& network === 'GG'&& level === '13'&& isNormal && (Name("Monday Monster Stack"))&& network === 'GG'&& level === '13'&& isNormal) {
	    return {
	      score: 82,
	      color: "green"
	    };
	  }	if((FromTo(120,150))&& network === 'GG'&& level === '14'&& isNormal && (Name("Monday Monster Stack"))&& network === 'GG'&& level === '14'&& isNormal) {
	    return {
	      score: 82,
	      color: "green"
	    };
	  }	if((FromTo(120,150))&& network === 'GG'&& level === '15'&& isNormal && (Name("Monday Monster Stack"))&& network === 'GG'&& level === '15'&& isNormal) {
	    return {
	      score: 82,
	      color: "green"
	    };
	  }	if((FromTo(200,250))&& network === 'GG'&& level === '13'&& isNormal && (Name("Bounty Hunters Big Game"))&& network === 'GG'&& level === '13'&& isNormal && (StartDay("Friday"))&& network === 'GG'&& level === '13'&& isNormal) {
	    return {
	      score: 82,
	      color: "green"
	    };
	  }	if((FromTo(200,215))&& network === 'GG'&& level === '13'&& isNormal && (Name("Bounty Hunters Big Game"))&& network === 'GG'&& level === '13'&& isNormal && (StartDay("Saturday"))&& network === 'GG'&& level === '13'&& isNormal) {
	    return {
	      score: 82,
	      color: "green"
	    };
	  }	if((FromTo(200,215))&& network === 'GG'&& level === '14'&& isNormal && (Name("Bounty Hunters Big Game"))&& network === 'GG'&& level === '14'&& isNormal && (StartDay("Friday"))&& network === 'GG'&& level === '14'&& isNormal) {
	    return {
	      score: 82,
	      color: "green"
	    };
	  }	if((FromTo(200,215))&& network === 'GG'&& level === '14'&& isNormal && (Name("Bounty Hunters Big Game"))&& network === 'GG'&& level === '14'&& isNormal && (StartDay("Saturday"))&& network === 'GG'&& level === '14'&& isNormal) {
	    return {
	      score: 82,
	      color: "green"
	    };
	  }	if((FromTo(200,215))&& network === 'GG'&& level === '15'&& isNormal && (Name("Bounty Hunters Big Game"))&& network === 'GG'&& level === '15'&& isNormal && (StartDay("Friday"))&& network === 'GG'&& level === '15'&& isNormal) {
	    return {
	      score: 82,
	      color: "green"
	    };
	  }	if((FromTo(200,215))&& network === 'GG'&& level === '15'&& isNormal && (Name("Bounty Hunters Big Game"))&& network === 'GG'&& level === '15'&& isNormal && (StartDay("Saturday"))&& network === 'GG'&& level === '15'&& isNormal) {
	    return {
	      score: 82,
	      color: "green"
	    };
	  }	if((FromTo(1,86))&& network === 'PS.eu'&& level === '8'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.eu'&& level === '8'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.eu'&& level === '8'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'PS.eu'&& level === '8'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.eu'&& level === '8'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.eu'&& level === '8'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'PS.eu'&& level === '8'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.eu'&& level === '8'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.eu'&& level === '8'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '9'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.eu'&& level === '9'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.eu'&& level === '9'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& network === 'PS.eu'&& level === '9'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.eu'&& level === '9'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.eu'&& level === '9'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'PS.eu'&& level === '9'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.eu'&& level === '9'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.eu'&& level === '9'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.eu'&& level === '10'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.eu'&& level === '10'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.eu'&& level === '10'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.eu'&& level === '10'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.eu'&& level === '10'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.eu'&& level === '10'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '11'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '11'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '11'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '11'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.eu'&& level === '11'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.eu'&& level === '11'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '11'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.eu'&& level === '11'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.eu'&& level === '11'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '12'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '12'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '12'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '12'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.eu'&& level === '12'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.eu'&& level === '12'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '12'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.eu'&& level === '12'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.eu'&& level === '12'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.eu'&& level === '13'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '13'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '13'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.eu'&& level === '13'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '13'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '13'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '13'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.eu'&& level === '13'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.eu'&& level === '13'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,500))&& network === 'PS.eu'&& level === '14'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 84,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.eu'&& level === '14'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.eu'&& level === '14'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.eu'&& level === '14'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '14'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '14'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.eu'&& level === '14'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '14'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '14'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.eu'&& level === '15'&& effmu === 'SuperA'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.eu'&& level === '15'&& effmu === 'SuperA'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.eu'&& level === '15'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.eu'&& level === '15'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.eu'&& level === '15'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.eu'&& level === '15'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.eu'&& level === '15'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.eu'&& level === '15'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'PS.eu'&& level === '7'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.eu'&& level === '7'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.eu'&& level === '7'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'PS.eu'&& level === '7'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.eu'&& level === '7'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.eu'&& level === '7'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.eu'&& level === '7'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.eu'&& level === '7'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.eu'&& level === '7'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'PS.eu'&& level === '6'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.eu'&& level === '6'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.eu'&& level === '6'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.eu'&& level === '6'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.eu'&& level === '6'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.eu'&& level === '6'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.eu'&& level === '6'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.eu'&& level === '6'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.eu'&& level === '6'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.eu'&& level === '5'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.eu'&& level === '5'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.eu'&& level === '5'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.eu'&& level === '5'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.eu'&& level === '5'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.eu'&& level === '5'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.eu'&& level === '5'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.eu'&& level === '5'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.eu'&& level === '5'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.eu'&& level === '4'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.eu'&& level === '4'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.eu'&& level === '4'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.eu'&& level === '4'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.eu'&& level === '4'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.eu'&& level === '4'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.eu'&& level === '4'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.eu'&& level === '4'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.eu'&& level === '4'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.eu'&& level === '3'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.eu'&& level === '3'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.eu'&& level === '3'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.eu'&& level === '3'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.eu'&& level === '3'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.eu'&& level === '3'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.eu'&& level === '3'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.eu'&& level === '3'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.eu'&& level === '3'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.eu'&& level === '2'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.eu'&& level === '2'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.eu'&& level === '2'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.eu'&& level === '2'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.eu'&& level === '2'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.eu'&& level === '2'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.eu'&& level === '2'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'PS.eu'&& level === '2'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'PS.eu'&& level === '2'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.eu'&& level === '1'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.eu'&& level === '1'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.eu'&& level === '1'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.eu'&& level === '1'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'PS.eu'&& level === '1'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'PS.eu'&& level === '1'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.eu'&& level === '1'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'PS.eu'&& level === '1'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'PS.eu'&& level === '1'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.eu'&& level === '0'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.eu'&& level === '0'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,6))&& network === 'PS.eu'&& level === '0'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === 'PS.eu'&& level === '0'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 59,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === 'PS.eu'&& level === '0'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 59,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'IP'&& level === '15'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Chico'&& level === '15'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.es'&& level === '15'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Party'&& level === '15'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'GG'&& level === '15'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === '888'&& level === '15'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WNMX'&& level === '15'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WPN'&& level === '15'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'IP'&& level === '15'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Chico'&& level === '15'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.es'&& level === '15'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Party'&& level === '15'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'GG'&& level === '15'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === '888'&& level === '15'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WNMX'&& level === '15'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WPN'&& level === '15'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'IP'&& level === '15'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Chico'&& level === '15'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.es'&& level === '15'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Party'&& level === '15'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'GG'&& level === '15'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === '888'&& level === '15'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WNMX'&& level === '15'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WPN'&& level === '15'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'IP'&& level === '15'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Chico'&& level === '15'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.es'&& level === '15'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Party'&& level === '15'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'GG'&& level === '15'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === '888'&& level === '15'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WNMX'&& level === '15'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'IP'&& level === '15'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Chico'&& level === '15'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.es'&& level === '15'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Party'&& level === '15'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'GG'&& level === '15'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === '888'&& level === '15'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WNMX'&& level === '15'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WPN'&& level === '15'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'IP'&& level === '15'&& effmu === 'SuperA'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Chico'&& level === '15'&& effmu === 'SuperA'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.es'&& level === '15'&& effmu === 'SuperA'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Party'&& level === '15'&& effmu === 'SuperA'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'GG'&& level === '15'&& effmu === 'SuperA'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === '888'&& level === '15'&& effmu === 'SuperA'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WNMX'&& level === '15'&& effmu === 'SuperA'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WPN'&& level === '15'&& effmu === 'SuperA'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'IP'&& level === '15'&& effmu === 'SuperA'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Chico'&& level === '15'&& effmu === 'SuperA'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.es'&& level === '15'&& effmu === 'SuperA'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Party'&& level === '15'&& effmu === 'SuperA'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'GG'&& level === '15'&& effmu === 'SuperA'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === '888'&& level === '15'&& effmu === 'SuperA'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WNMX'&& level === '15'&& effmu === 'SuperA'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WPN'&& level === '15'&& effmu === 'SuperA'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,500))&& network === 'IP'&& level === '14'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 84,
	      color: "black"
	    };
	  }	if((FromTo(1,500))&& network === 'Chico'&& level === '14'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 84,
	      color: "black"
	    };
	  }	if((FromTo(1,500))&& network === 'PS.es'&& level === '14'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 84,
	      color: "black"
	    };
	  }	if((FromTo(1,500))&& network === 'Party'&& level === '14'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 84,
	      color: "black"
	    };
	  }	if((FromTo(1,500))&& network === 'GG'&& level === '14'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 84,
	      color: "black"
	    };
	  }	if((FromTo(1,500))&& network === '888'&& level === '14'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 84,
	      color: "black"
	    };
	  }	if((FromTo(1,500))&& network === 'WPN'&& level === '14'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 84,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'IP'&& level === '14'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Chico'&& level === '14'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.es'&& level === '14'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Party'&& level === '14'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'GG'&& level === '14'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === '888'&& level === '14'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WNMX'&& level === '14'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WPN'&& level === '14'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'IP'&& level === '14'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Chico'&& level === '14'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.es'&& level === '14'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Party'&& level === '14'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'GG'&& level === '14'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === '888'&& level === '14'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WNMX'&& level === '14'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WPN'&& level === '14'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'IP'&& level === '14'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Chico'&& level === '14'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.es'&& level === '14'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Party'&& level === '14'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'GG'&& level === '14'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === '888'&& level === '14'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WNMX'&& level === '14'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WPN'&& level === '14'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '14'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '14'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '14'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '14'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '14'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '14'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '14'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '14'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'IP'&& level === '14'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Chico'&& level === '14'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.es'&& level === '14'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Party'&& level === '14'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'GG'&& level === '14'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === '888'&& level === '14'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WNMX'&& level === '14'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WPN'&& level === '14'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '14'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '14'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '14'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '14'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '14'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '14'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '14'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '14'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '14'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '14'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '14'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '14'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '14'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '14'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '14'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '14'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'IP'&& level === '13'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Chico'&& level === '13'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.es'&& level === '13'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Party'&& level === '13'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'GG'&& level === '13'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === '888'&& level === '13'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WNMX'&& level === '13'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WPN'&& level === '13'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '13'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '13'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '13'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '13'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '13'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '13'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '13'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '13'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '13'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '13'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '13'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '13'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '13'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '13'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '13'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '13'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'IP'&& level === '13'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Chico'&& level === '13'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'PS.es'&& level === '13'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'Party'&& level === '13'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'GG'&& level === '13'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === '888'&& level === '13'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WNMX'&& level === '13'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& network === 'WPN'&& level === '13'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '13'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '13'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '13'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '13'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '13'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '13'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '13'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '13'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '13'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '13'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '13'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '13'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '13'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '13'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '13'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '13'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '13'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '13'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '13'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '13'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '13'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '13'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '13'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '13'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'IP'&& level === '13'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Chico'&& level === '13'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.es'&& level === '13'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Party'&& level === '13'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'GG'&& level === '13'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === '888'&& level === '13'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WNMX'&& level === '13'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WPN'&& level === '13'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'IP'&& level === '13'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Chico'&& level === '13'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.es'&& level === '13'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Party'&& level === '13'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'GG'&& level === '13'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === '888'&& level === '13'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WNMX'&& level === '13'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WPN'&& level === '13'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '12'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '12'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '12'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '12'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '12'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '12'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '12'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '12'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '12'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '12'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '12'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '12'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '12'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '12'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '12'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '12'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '12'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '12'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '12'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '12'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '12'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '12'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '12'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '12'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '12'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '12'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '12'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '12'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '12'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '12'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '12'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'IP'&& level === '12'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Chico'&& level === '12'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.es'&& level === '12'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Party'&& level === '12'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'GG'&& level === '12'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === '888'&& level === '12'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WNMX'&& level === '12'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WPN'&& level === '12'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'IP'&& level === '12'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Chico'&& level === '12'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.es'&& level === '12'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Party'&& level === '12'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'GG'&& level === '12'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === '888'&& level === '12'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WNMX'&& level === '12'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WPN'&& level === '12'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '12'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '12'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '12'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '12'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '12'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '12'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '12'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '12'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'IP'&& level === '12'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Chico'&& level === '12'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.es'&& level === '12'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Party'&& level === '12'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'GG'&& level === '12'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === '888'&& level === '12'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WNMX'&& level === '12'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WPN'&& level === '12'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'IP'&& level === '12'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Chico'&& level === '12'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.es'&& level === '12'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Party'&& level === '12'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'GG'&& level === '12'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === '888'&& level === '12'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WNMX'&& level === '12'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WPN'&& level === '12'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '11'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '11'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '11'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '11'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '11'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '11'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '11'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '11'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '11'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '11'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '11'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '11'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '11'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '11'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '11'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '11'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '11'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '11'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '11'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '11'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '11'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '11'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '11'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '11'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '11'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '11'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '11'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '11'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '11'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '11'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '11'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '11'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'IP'&& level === '11'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Chico'&& level === '11'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.es'&& level === '11'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Party'&& level === '11'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'GG'&& level === '11'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === '888'&& level === '11'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WNMX'&& level === '11'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WPN'&& level === '11'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'IP'&& level === '11'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Chico'&& level === '11'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.es'&& level === '11'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Party'&& level === '11'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'GG'&& level === '11'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === '888'&& level === '11'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WNMX'&& level === '11'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WPN'&& level === '11'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '11'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '11'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '11'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '11'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '11'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '11'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '11'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '11'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'IP'&& level === '11'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Chico'&& level === '11'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.es'&& level === '11'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Party'&& level === '11'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'GG'&& level === '11'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === '888'&& level === '11'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WNMX'&& level === '11'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WPN'&& level === '11'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'IP'&& level === '11'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Chico'&& level === '11'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.es'&& level === '11'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Party'&& level === '11'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'GG'&& level === '11'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === '888'&& level === '11'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WNMX'&& level === '11'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WPN'&& level === '11'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.eu'&& level === '10'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '10'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '10'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '10'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '10'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '10'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '10'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '10'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '10'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'IP'&& level === '10'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Chico'&& level === '10'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.es'&& level === '10'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Party'&& level === '10'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'GG'&& level === '10'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === '888'&& level === '10'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WNMX'&& level === '10'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WPN'&& level === '10'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'IP'&& level === '10'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Chico'&& level === '10'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.es'&& level === '10'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Party'&& level === '10'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'GG'&& level === '10'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === '888'&& level === '10'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WNMX'&& level === '10'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WPN'&& level === '10'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'IP'&& level === '10'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Chico'&& level === '10'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.es'&& level === '10'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Party'&& level === '10'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'GG'&& level === '10'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === '888'&& level === '10'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WNMX'&& level === '10'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WPN'&& level === '10'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'IP'&& level === '10'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Chico'&& level === '10'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.es'&& level === '10'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Party'&& level === '10'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'GG'&& level === '10'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === '888'&& level === '10'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WNMX'&& level === '10'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WPN'&& level === '10'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'IP'&& level === '10'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Chico'&& level === '10'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.es'&& level === '10'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Party'&& level === '10'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'GG'&& level === '10'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === '888'&& level === '10'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WNMX'&& level === '10'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WPN'&& level === '10'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'IP'&& level === '10'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Chico'&& level === '10'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.es'&& level === '10'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Party'&& level === '10'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'GG'&& level === '10'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === '888'&& level === '10'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WNMX'&& level === '10'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WPN'&& level === '10'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'IP'&& level === '9'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Chico'&& level === '9'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'PS.es'&& level === '9'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'Party'&& level === '9'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '9'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === '888'&& level === '9'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '9'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WPN'&& level === '9'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'IP'&& level === '9'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Chico'&& level === '9'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.es'&& level === '9'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Party'&& level === '9'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'GG'&& level === '9'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === '888'&& level === '9'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WNMX'&& level === '9'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WPN'&& level === '9'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'IP'&& level === '9'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Chico'&& level === '9'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'PS.es'&& level === '9'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'Party'&& level === '9'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'GG'&& level === '9'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === '888'&& level === '9'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WNMX'&& level === '9'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& network === 'WPN'&& level === '9'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& network === 'IP'&& level === '9'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& network === 'Chico'&& level === '9'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& network === 'PS.es'&& level === '9'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& network === 'Party'&& level === '9'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& network === 'GG'&& level === '9'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& network === '888'&& level === '9'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& network === 'WPN'&& level === '9'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'IP'&& level === '9'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Chico'&& level === '9'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.es'&& level === '9'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Party'&& level === '9'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'GG'&& level === '9'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === '888'&& level === '9'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WNMX'&& level === '9'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WPN'&& level === '9'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'IP'&& level === '9'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Chico'&& level === '9'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.es'&& level === '9'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Party'&& level === '9'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'GG'&& level === '9'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === '888'&& level === '9'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WNMX'&& level === '9'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'IP'&& level === '9'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'Chico'&& level === '9'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'PS.es'&& level === '9'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'Party'&& level === '9'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'GG'&& level === '9'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === '888'&& level === '9'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'IP'&& level === '9'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Chico'&& level === '9'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.es'&& level === '9'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Party'&& level === '9'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'GG'&& level === '9'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === '888'&& level === '9'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WNMX'&& level === '9'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WPN'&& level === '9'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'IP'&& level === '9'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Chico'&& level === '9'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.es'&& level === '9'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Party'&& level === '9'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'GG'&& level === '9'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === '888'&& level === '9'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WNMX'&& level === '9'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WPN'&& level === '9'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& network === 'IP'&& level === '8'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& network === 'Chico'&& level === '8'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& network === 'PS.es'&& level === '8'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& network === 'Party'&& level === '8'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& network === 'GG'&& level === '8'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& network === '888'&& level === '8'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& network === 'WNMX'&& level === '8'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& network === 'WPN'&& level === '8'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'IP'&& level === '8'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Chico'&& level === '8'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.es'&& level === '8'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Party'&& level === '8'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'GG'&& level === '8'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === '888'&& level === '8'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WNMX'&& level === '8'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WPN'&& level === '8'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'IP'&& level === '8'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Chico'&& level === '8'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.es'&& level === '8'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Party'&& level === '8'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'GG'&& level === '8'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === '888'&& level === '8'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WNMX'&& level === '8'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WPN'&& level === '8'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'IP'&& level === '8'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'Chico'&& level === '8'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'PS.es'&& level === '8'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'Party'&& level === '8'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'GG'&& level === '8'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === '888'&& level === '8'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'IP'&& level === '8'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Chico'&& level === '8'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Party'&& level === '8'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.es'&& level === '8'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'GG'&& level === '8'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === '888'&& level === '8'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WNMX'&& level === '8'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WPN'&& level === '8'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'IP'&& level === '8'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Chico'&& level === '8'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.es'&& level === '8'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Party'&& level === '8'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'GG'&& level === '8'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === '888'&& level === '8'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WNMX'&& level === '8'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WPN'&& level === '8'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'IP'&& level === '8'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'Chico'&& level === '8'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'PS.es'&& level === '8'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'Party'&& level === '8'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'GG'&& level === '8'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === '888'&& level === '8'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'WPN'&& level === '8'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'IP'&& level === '8'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Chico'&& level === '8'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.es'&& level === '8'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Party'&& level === '8'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'GG'&& level === '8'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === '888'&& level === '8'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WNMX'&& level === '8'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WPN'&& level === '8'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'IP'&& level === '8'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Chico'&& level === '8'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.es'&& level === '8'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Party'&& level === '8'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'GG'&& level === '8'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === '888'&& level === '8'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WNMX'&& level === '8'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WPN'&& level === '8'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'IP'&& level === '7'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'Chico'&& level === '7'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'PS.es'&& level === '7'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'Party'&& level === '7'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'GG'&& level === '7'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === '888'&& level === '7'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'WPN'&& level === '7'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'IP'&& level === '7'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Chico'&& level === '7'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.es'&& level === '7'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Party'&& level === '7'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'GG'&& level === '7'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === '888'&& level === '7'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WNMX'&& level === '7'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WPN'&& level === '7'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'IP'&& level === '7'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Chico'&& level === '7'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'PS.es'&& level === '7'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'Party'&& level === '7'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'GG'&& level === '7'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === '888'&& level === '7'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WNMX'&& level === '7'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,55))&& network === 'WPN'&& level === '7'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'IP'&& level === '7'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'Chico'&& level === '7'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'PS.es'&& level === '7'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'Party'&& level === '7'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'GG'&& level === '7'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === '888'&& level === '7'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'WPN'&& level === '7'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'IP'&& level === '7'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Chico'&& level === '7'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.es'&& level === '7'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Party'&& level === '7'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'GG'&& level === '7'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === '888'&& level === '7'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WNMX'&& level === '7'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WPN'&& level === '7'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'IP'&& level === '7'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Chico'&& level === '7'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.es'&& level === '7'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Party'&& level === '7'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'GG'&& level === '7'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === '888'&& level === '7'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WNMX'&& level === '7'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WPN'&& level === '7'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'IP'&& level === '7'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Chico'&& level === '7'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.es'&& level === '7'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Party'&& level === '7'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'GG'&& level === '7'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === '888'&& level === '7'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WPN'&& level === '7'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'IP'&& level === '7'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Chico'&& level === '7'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.es'&& level === '7'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Party'&& level === '7'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'GG'&& level === '7'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === '888'&& level === '7'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WNMX'&& level === '7'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WPN'&& level === '7'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'IP'&& level === '7'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Chico'&& level === '7'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.es'&& level === '7'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Party'&& level === '7'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'GG'&& level === '7'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === '888'&& level === '7'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WNMX'&& level === '7'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WPN'&& level === '7'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'IP'&& level === '6'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'Chico'&& level === '6'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'PS.es'&& level === '6'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'Party'&& level === '6'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === '888'&& level === '6'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'WNMX'&& level === '6'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'WPN'&& level === '6'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'IP'&& level === '6'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Chico'&& level === '6'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.es'&& level === '6'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Party'&& level === '6'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'GG'&& level === '6'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === '888'&& level === '6'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WNMX'&& level === '6'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WPN'&& level === '6'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'IP'&& level === '6'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Chico'&& level === '6'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.es'&& level === '6'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Party'&& level === '6'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'GG'&& level === '6'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === '888'&& level === '6'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WNMX'&& level === '6'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WPN'&& level === '6'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'IP'&& level === '6'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Chico'&& level === '6'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.es'&& level === '6'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Party'&& level === '6'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'GG'&& level === '6'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === '888'&& level === '6'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WPN'&& level === '6'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'IP'&& level === '6'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Chico'&& level === '6'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.es'&& level === '6'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Party'&& level === '6'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'GG'&& level === '6'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === '888'&& level === '6'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WNMX'&& level === '6'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WPN'&& level === '6'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'IP'&& level === '6'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Chico'&& level === '6'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.es'&& level === '6'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Party'&& level === '6'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'GG'&& level === '6'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === '888'&& level === '6'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WNMX'&& level === '6'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WPN'&& level === '6'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'IP'&& level === '6'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Chico'&& level === '6'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.es'&& level === '6'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Party'&& level === '6'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'GG'&& level === '6'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === '888'&& level === '6'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WPN'&& level === '6'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'IP'&& level === '6'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Chico'&& level === '6'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.es'&& level === '6'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Party'&& level === '6'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'GG'&& level === '6'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === '888'&& level === '6'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WNMX'&& level === '6'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WPN'&& level === '6'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'IP'&& level === '6'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Chico'&& level === '6'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.es'&& level === '6'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Party'&& level === '6'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'GG'&& level === '6'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === '888'&& level === '6'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WNMX'&& level === '6'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WPN'&& level === '6'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'IP'&& level === '5'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Chico'&& level === '5'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.es'&& level === '5'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Party'&& level === '5'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'GG'&& level === '5'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === '888'&& level === '5'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WPN'&& level === '5'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'IP'&& level === '5'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Chico'&& level === '5'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.es'&& level === '5'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Party'&& level === '5'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'GG'&& level === '5'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === '888'&& level === '5'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WNMX'&& level === '5'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WPN'&& level === '5'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'IP'&& level === '5'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Chico'&& level === '5'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.es'&& level === '5'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Party'&& level === '5'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'GG'&& level === '5'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === '888'&& level === '5'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WNMX'&& level === '5'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WPN'&& level === '5'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'IP'&& level === '5'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Chico'&& level === '5'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.es'&& level === '5'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Party'&& level === '5'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'GG'&& level === '5'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === '888'&& level === '5'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WNMX'&& level === '5'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WPN'&& level === '5'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'IP'&& level === '5'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Chico'&& level === '5'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.es'&& level === '5'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Party'&& level === '5'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'GG'&& level === '5'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === '888'&& level === '5'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WNMX'&& level === '5'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WPN'&& level === '5'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'IP'&& level === '5'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Chico'&& level === '5'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.es'&& level === '5'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Party'&& level === '5'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'GG'&& level === '5'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === '888'&& level === '5'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WNMX'&& level === '5'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WPN'&& level === '5'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'IP'&& level === '5'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Chico'&& level === '5'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.es'&& level === '5'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Party'&& level === '5'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'GG'&& level === '5'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === '888'&& level === '5'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WNMX'&& level === '5'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WPN'&& level === '5'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'IP'&& level === '5'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Chico'&& level === '5'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.es'&& level === '5'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Party'&& level === '5'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'GG'&& level === '5'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === '888'&& level === '5'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WNMX'&& level === '5'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WPN'&& level === '5'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'IP'&& level === '5'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Chico'&& level === '5'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.es'&& level === '5'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Party'&& level === '5'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'GG'&& level === '5'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === '888'&& level === '5'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WNMX'&& level === '5'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WPN'&& level === '5'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'IP'&& level === '4'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Chico'&& level === '4'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.es'&& level === '4'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Party'&& level === '4'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'GG'&& level === '4'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === '888'&& level === '4'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WNMX'&& level === '4'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WPN'&& level === '4'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'IP'&& level === '4'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Chico'&& level === '4'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.es'&& level === '4'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Party'&& level === '4'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'GG'&& level === '4'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === '888'&& level === '4'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WNMX'&& level === '4'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WPN'&& level === '4'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'IP'&& level === '4'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Chico'&& level === '4'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.es'&& level === '4'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Party'&& level === '4'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'GG'&& level === '4'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === '888'&& level === '4'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WNMX'&& level === '4'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WPN'&& level === '4'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'IP'&& level === '4'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Chico'&& level === '4'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'PS.es'&& level === '4'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'Party'&& level === '4'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'GG'&& level === '4'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === '888'&& level === '4'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WNMX'&& level === '4'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,44))&& network === 'WPN'&& level === '4'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'IP'&& level === '4'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Chico'&& level === '4'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.es'&& level === '4'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Party'&& level === '4'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'GG'&& level === '4'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === '888'&& level === '4'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WNMX'&& level === '4'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WPN'&& level === '4'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'IP'&& level === '4'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Chico'&& level === '4'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.es'&& level === '4'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Party'&& level === '4'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'GG'&& level === '4'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === '888'&& level === '4'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WNMX'&& level === '4'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WPN'&& level === '4'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'IP'&& level === '4'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Chico'&& level === '4'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.es'&& level === '4'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Party'&& level === '4'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'GG'&& level === '4'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === '888'&& level === '4'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WNMX'&& level === '4'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WPN'&& level === '4'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'IP'&& level === '4'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Chico'&& level === '4'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.es'&& level === '4'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Party'&& level === '4'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'GG'&& level === '4'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === '888'&& level === '4'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WNMX'&& level === '4'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WPN'&& level === '4'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'IP'&& level === '4'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Chico'&& level === '4'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.es'&& level === '4'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Party'&& level === '4'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'GG'&& level === '4'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === '888'&& level === '4'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WNMX'&& level === '4'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WPN'&& level === '4'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'IP'&& level === '3'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Chico'&& level === '3'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.es'&& level === '3'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Party'&& level === '3'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'GG'&& level === '3'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === '888'&& level === '3'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WNMX'&& level === '3'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WPN'&& level === '3'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'IP'&& level === '3'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Chico'&& level === '3'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.es'&& level === '3'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Party'&& level === '3'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'GG'&& level === '3'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === '888'&& level === '3'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WNMX'&& level === '3'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WPN'&& level === '3'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'IP'&& level === '3'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Chico'&& level === '3'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.es'&& level === '3'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Party'&& level === '3'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'GG'&& level === '3'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === '888'&& level === '3'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WNMX'&& level === '3'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WPN'&& level === '3'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'IP'&& level === '3'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Chico'&& level === '3'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'PS.es'&& level === '3'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'Party'&& level === '3'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'GG'&& level === '3'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === '888'&& level === '3'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WNMX'&& level === '3'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'IP'&& level === '3'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,33))&& network === 'WPN'&& level === '3'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Chico'&& level === '3'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.es'&& level === '3'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Party'&& level === '3'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'GG'&& level === '3'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === '888'&& level === '3'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WNMX'&& level === '3'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WPN'&& level === '3'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'IP'&& level === '3'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Chico'&& level === '3'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.es'&& level === '3'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Party'&& level === '3'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'GG'&& level === '3'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === '888'&& level === '3'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WNMX'&& level === '3'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WPN'&& level === '3'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'IP'&& level === '3'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Chico'&& level === '3'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.es'&& level === '3'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Party'&& level === '3'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'GG'&& level === '3'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === '888'&& level === '3'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WNMX'&& level === '3'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WPN'&& level === '3'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'IP'&& level === '3'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Chico'&& level === '3'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.es'&& level === '3'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Party'&& level === '3'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'GG'&& level === '3'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === '888'&& level === '3'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WNMX'&& level === '3'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WPN'&& level === '3'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'IP'&& level === '3'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Chico'&& level === '3'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.es'&& level === '3'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Party'&& level === '3'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'GG'&& level === '3'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === '888'&& level === '3'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WNMX'&& level === '3'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WPN'&& level === '3'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'IP'&& level === '2'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Chico'&& level === '2'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.es'&& level === '2'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Party'&& level === '2'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'GG'&& level === '2'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === '888'&& level === '2'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WNMX'&& level === '2'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WPN'&& level === '2'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'IP'&& level === '2'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Chico'&& level === '2'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.es'&& level === '2'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Party'&& level === '2'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'GG'&& level === '2'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === '888'&& level === '2'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WNMX'&& level === '2'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WPN'&& level === '2'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'IP'&& level === '2'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Chico'&& level === '2'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.es'&& level === '2'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Party'&& level === '2'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'GG'&& level === '2'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === '888'&& level === '2'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WNMX'&& level === '2'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WPN'&& level === '2'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'IP'&& level === '2'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Chico'&& level === '2'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.es'&& level === '2'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Party'&& level === '2'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'GG'&& level === '2'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === '888'&& level === '2'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WNMX'&& level === '2'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WPN'&& level === '2'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'IP'&& level === '2'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Chico'&& level === '2'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.es'&& level === '2'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Party'&& level === '2'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'GG'&& level === '2'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === '888'&& level === '2'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WNMX'&& level === '2'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WPN'&& level === '2'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'IP'&& level === '2'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Chico'&& level === '2'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.es'&& level === '2'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Party'&& level === '2'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'GG'&& level === '2'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === '888'&& level === '2'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WNMX'&& level === '2'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WPN'&& level === '2'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'IP'&& level === '2'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Chico'&& level === '2'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.es'&& level === '2'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Party'&& level === '2'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'GG'&& level === '2'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === '888'&& level === '2'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WNMX'&& level === '2'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WPN'&& level === '2'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'IP'&& level === '2'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Chico'&& level === '2'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'PS.es'&& level === '2'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Party'&& level === '2'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'GG'&& level === '2'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === '888'&& level === '2'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WNMX'&& level === '2'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WPN'&& level === '2'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'IP'&& level === '2'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Chico'&& level === '2'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'PS.es'&& level === '2'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Party'&& level === '2'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'GG'&& level === '2'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === '888'&& level === '2'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WNMX'&& level === '2'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WPN'&& level === '2'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'IP'&& level === '1'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Chico'&& level === '1'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'PS.es'&& level === '1'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'Party'&& level === '1'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'GG'&& level === '1'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === '888'&& level === '1'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WNMX'&& level === '1'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,22))&& network === 'WPN'&& level === '1'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'IP'&& level === '1'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Chico'&& level === '1'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.es'&& level === '1'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Party'&& level === '1'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'GG'&& level === '1'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === '888'&& level === '1'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WNMX'&& level === '1'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WPN'&& level === '1'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'IP'&& level === '1'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Chico'&& level === '1'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.es'&& level === '1'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Party'&& level === '1'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'GG'&& level === '1'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === '888'&& level === '1'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WNMX'&& level === '1'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WPN'&& level === '1'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'IP'&& level === '1'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Chico'&& level === '1'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.es'&& level === '1'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Party'&& level === '1'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'GG'&& level === '1'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === '888'&& level === '1'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WNMX'&& level === '1'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WPN'&& level === '1'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'IP'&& level === '1'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Chico'&& level === '1'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'PS.es'&& level === '1'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Party'&& level === '1'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'GG'&& level === '1'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === '888'&& level === '1'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WNMX'&& level === '1'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WPN'&& level === '1'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'IP'&& level === '1'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Chico'&& level === '1'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'PS.es'&& level === '1'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Party'&& level === '1'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'GG'&& level === '1'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === '888'&& level === '1'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WNMX'&& level === '1'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WPN'&& level === '1'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'IP'&& level === '1'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Chico'&& level === '1'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.es'&& level === '1'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Party'&& level === '1'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'GG'&& level === '1'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === '888'&& level === '1'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WNMX'&& level === '1'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WPN'&& level === '1'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'IP'&& level === '1'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Chico'&& level === '1'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'PS.es'&& level === '1'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Party'&& level === '1'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'GG'&& level === '1'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === '888'&& level === '1'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WNMX'&& level === '1'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WPN'&& level === '1'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'IP'&& level === '1'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Chico'&& level === '1'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'PS.es'&& level === '1'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Party'&& level === '1'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'GG'&& level === '1'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === '888'&& level === '1'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WNMX'&& level === '1'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WPN'&& level === '1'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'IP'&& level === '0'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Chico'&& level === '0'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.es'&& level === '0'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Party'&& level === '0'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'GG'&& level === '0'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === '888'&& level === '0'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WNMX'&& level === '0'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WPN'&& level === '0'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'IP'&& level === '0'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Chico'&& level === '0'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'PS.es'&& level === '0'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Party'&& level === '0'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === '888'&& level === '0'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WNMX'&& level === '0'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WPN'&& level === '0'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'IP'&& level === '0'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Chico'&& level === '0'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'PS.es'&& level === '0'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Party'&& level === '0'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === '888'&& level === '0'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WNMX'&& level === '0'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WPN'&& level === '0'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'IP'&& level === '0'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Chico'&& level === '0'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'PS.es'&& level === '0'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'Party'&& level === '0'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'GG'&& level === '0'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === '888'&& level === '0'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WNMX'&& level === '0'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,11))&& network === 'WPN'&& level === '0'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'IP'&& level === '0'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Chico'&& level === '0'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'PS.es'&& level === '0'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Party'&& level === '0'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === '888'&& level === '0'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WNMX'&& level === '0'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WPN'&& level === '0'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'IP'&& level === '0'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Chico'&& level === '0'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'PS.es'&& level === '0'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'Party'&& level === '0'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === '888'&& level === '0'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WNMX'&& level === '0'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,7.5))&& network === 'WPN'&& level === '0'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,6))&& network === 'IP'&& level === '0'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,6))&& network === 'Chico'&& level === '0'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,6))&& network === 'PS.es'&& level === '0'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,6))&& network === 'Party'&& level === '0'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,6))&& network === 'GG'&& level === '0'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,6))&& network === '888'&& level === '0'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,6))&& network === 'WNMX'&& level === '0'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,6))&& network === 'WPN'&& level === '0'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === 'IP'&& level === '0'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 59,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === 'Chico'&& level === '0'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 59,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === 'PS.es'&& level === '0'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 59,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === 'Party'&& level === '0'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 59,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === '888'&& level === '0'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 59,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === 'WNMX'&& level === '0'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 59,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === 'WPN'&& level === '0'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 59,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === 'IP'&& level === '0'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 59,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === 'Chico'&& level === '0'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 59,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === 'PS.es'&& level === '0'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 59,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === 'Party'&& level === '0'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 59,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === '888'&& level === '0'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 59,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === 'WNMX'&& level === '0'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 59,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === 'WPN'&& level === '0'&& effmu === 'C'&& isSuperTurbo) {
	    return {
	      score: 59,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'WPN'&& level === '9'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'GG'&& level === '14'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'WNMX'&& level === '6'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'WNMX'&& level === '6'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'WNMX'&& level === '5'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(12,25))&& network === 'PS.es'&& level === '2'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(12,25))&& network === 'WNMX'&& level === '2'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(12,25))&& network === 'WNMX'&& level === '1'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(23,30))&& network === 'WNMX'&& level === '1'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(12,25))&& network === 'WNMX'&& level === '1'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 64,
	      color: "black"
	    };
	  }	if((FromTo(12,25))&& network === 'WNMX'&& level === '1'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 62,
	      color: "black"
	    };
	  }	if((FromTo(12,28))&& network === 'PS.es'&& level === '2'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 65,
	      color: "black"
	    };
	  }	if((FromTo(8,28))&& network === 'PS.es'&& level === '2'&& effmu === 'C'&& isTurbo) {
	    return {
	      score: 62,
	      color: "black"
	    };
	  }	if((FromTo(501,1100))&& network === 'PS.eu'&& level === '14'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 83,
	      color: "black"
	    };
	  }	if((FromTo(216,1100))&& network === 'PS.eu'&& level === '14'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(216,1100))&& network === 'PS.eu'&& level === '14'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(501,1100))&& network === 'GG'&& level === '14'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 83,
	      color: "black"
	    };
	  }	if((FromTo(216,1100))&& network === 'GG'&& level === '14'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(216,1100))&& network === 'GG'&& level === '14'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(216,1100))&& network === 'PS.eu'&& level === '13'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(216,1100))&& network === 'PS.eu'&& level === '13'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(110,256))&& network === 'PS.eu'&& level === '13'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(216,1100))&& network === 'GG'&& level === '13'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 80,
	      color: "black"
	    };
	  }	if((FromTo(216,1100))&& network === 'GG'&& level === '13'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(110,256))&& network === 'GG'&& level === '13'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(110,256))&& network === 'PS.eu'&& level === '12'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(110,256))&& network === 'GG'&& level === '12'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(110,240))&& network === 'PS.eu'&& level === '12'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(110,240))&& network === 'GG'&& level === '12'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(110,220))&& network === 'PS.eu'&& level === '12'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(110,220))&& network === 'GG'&& level === '12'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(110,220))&& network === 'PS.eu'&& level === '11'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(110,220))&& network === 'GG'&& level === '11'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(110,220))&& network === 'PS.eu'&& level === '11'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(110,220))&& network === 'GG'&& level === '11'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(110,170))&& network === 'PS.eu'&& level === '11'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(110,170))&& network === 'GG'&& level === '11'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(110,170))&& network === 'PS.eu'&& level === '10'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(110,170))&& network === 'GG'&& level === '10'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(110,170))&& network === 'PS.eu'&& level === '9'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(110,170))&& network === 'GG'&& level === '9'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(87,120))&& network === 'PS.eu'&& level === '9'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(87,120))&& network === 'GG'&& level === '9'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(61,110))&& network === 'PS.eu'&& level === '9'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(61,110))&& network === 'GG'&& level === '9'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(87,220))&& network === 'PS.eu'&& level === '8'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(87,220))&& network === 'GG'&& level === '8'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(61,110))&& network === 'GG'&& level === '8'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(61,110))&& network === 'PS.eu'&& level === '8'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(61,110))&& network === 'PS.eu'&& level === '8'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(61,110))&& network === 'GG'&& level === '8'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(61,220))&& network === 'PS.eu'&& level === '7'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(61,220))&& network === 'GG'&& level === '7'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(61,110))&& network === 'PS.eu'&& level === '7'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(61,110))&& network === 'GG'&& level === '7'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(45,110))&& network === 'PS.eu'&& level === '7'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(45,110))&& network === 'GG'&& level === '7'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(61,110))&& network === 'PS.eu'&& level === '6'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(45,110))&& network === 'PS.eu'&& level === '6'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(45,110))&& network === 'GG'&& level === '6'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(45,110))&& network === 'PS.eu'&& level === '6'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(45,110))&& network === 'GG'&& level === '6'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(45,110))&& network === 'PS.eu'&& level === '5'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(45,110))&& network === 'GG'&& level === '5'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(45,110))&& network === 'PS.eu'&& level === '5'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(45,110))&& network === 'GG'&& level === '5'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(34,60))&& network === 'PS.eu'&& level === '5'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(34,60))&& network === 'GG'&& level === '5'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(45,110))&& network === 'PS.eu'&& level === '4'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(45,110))&& network === 'GG'&& level === '4'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(45,60))&& network === 'PS.eu'&& level === '4'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(45,60))&& network === 'GG'&& level === '4'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(34,60))&& network === 'PS.eu'&& level === '4'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(34,60))&& network === 'GG'&& level === '4'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(34,60))&& network === 'PS.eu'&& level === '3'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(34,60))&& network === 'GG'&& level === '3'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 69,
	      color: "black"
	    };
	  }	if((FromTo(34,60))&& network === 'PS.eu'&& level === '3'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(34,60))&& network === 'GG'&& level === '3'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(23,45))&& network === 'PS.eu'&& level === '3'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(23,45))&& network === 'GG'&& level === '3'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(23,45))&& network === 'PS.eu'&& level === '2'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(23,45))&& network === 'GG'&& level === '2'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 68,
	      color: "black"
	    };
	  }	if((FromTo(23,35))&& network === 'PS.eu'&& level === '2'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(23,35))&& network === 'GG'&& level === '2'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 67,
	      color: "black"
	    };
	  }	if((FromTo(12,24))&& network === 'PS.eu'&& level === '2'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 64,
	      color: "black"
	    };
	  }	if((FromTo(12,24))&& network === 'GG'&& level === '2'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 64,
	      color: "black"
	    };
	  }	if((FromTo(23,34))&& network === 'PS.eu'&& level === '1'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(23,34))&& network === 'GG'&& level === '1'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 66,
	      color: "black"
	    };
	  }	if((FromTo(12,23))&& network === 'PS.eu'&& level === '1'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 64,
	      color: "black"
	    };
	  }	if((FromTo(12,23))&& network === 'GG'&& level === '1'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 64,
	      color: "black"
	    };
	  }	if((FromTo(12,23))&& network === 'PS.eu'&& level === '1'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 62,
	      color: "black"
	    };
	  }	if((FromTo(12,23))&& network === 'GG'&& level === '1'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 62,
	      color: "black"
	    };
	  }	if((FromTo(12,23))&& network === 'PS.eu'&& level === '0'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 62,
	      color: "black"
	    };
	  }	if((FromTo(12,23))&& network === 'GG'&& level === '0'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 62,
	      color: "black"
	    };
	  }	if((FromTo(12,23))&& network === 'PS.eu'&& level === '0'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(12,23))&& network === 'GG'&& level === '0'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(7,12))&& network === 'PS.eu'&& level === '0'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 60,
	      color: "black"
	    };
	  }	if((FromTo(7,12))&& network === 'GG'&& level === '0'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 60,
	      color: "black"
	    };
	  }	if((FromTo(1,2500))&& level === '15'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 86,
	      color: "black"
	    };
	  }	if((FromTo(1,3000))&& level === '15'&& effmu === 'SuperA'&& isNormal) {
	    return {
	      score: 87,
	      color: "black"
	    };
	  }	if((FromTo(1,500))&& level === '15'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 84,
	      color: "black"
	    };
	  }	if((FromTo(501,1100))&& level === '15'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 83,
	      color: "black"
	    };
	  }	if((FromTo(1,215))&& level === '15'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(216,1100))&& level === '15'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,170))&& level === '10'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& level === '10'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(87,120))&& level === '10'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(110,240))&& level === '17'&& effmu === 'B'&& isNormal&& !isKo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,150))&& level === '17'&& effmu === 'B'&& isNormal&& isKo) {
	    return {
	      score: 83,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& level === '17'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(1,82))&& level === '17'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 76,
	      color: "black"
	    };
	  }	if((FromTo(67,109))&& level === '17'&& effmu === 'B'&& isNormal&& !isKo) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,66))&& level === '17'&& effmu === 'B'&& isNormal&& !isKo) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,66))&& network === 'WPN'&& level === '16'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 81,
	      color: "black"
	    };
	  }	if((FromTo(1,150))&& network === 'WPN'&& level === '16'&& effmu === 'B'&& isNormal&& isKo) {
	    return {
	      score: 83,
	      color: "black"
	    };
	  }	if((FromTo(151,240))&& network === 'WPN'&& level === '16'&& effmu === 'B'&& isNormal&& isKo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(151,240))&& level === '17'&& effmu === 'B'&& isNormal&& isKo) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,109))&& network === 'WNMX'&& level === '12'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(110,250))&& network === 'WNMX'&& level === '9'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,86))&& network === 'WNMX'&& level === '9'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'WNMX'&& level === '9'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(110,250))&& network === 'WNMX'&& level === '10'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(110,250))&& network === 'WNMX'&& level === '10'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(110,250))&& network === 'WNMX'&& level === '10'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(110,250))&& network === 'WNMX'&& level === '11'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(110,250))&& network === 'WNMX'&& level === '11'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(110,250))&& network === 'WNMX'&& level === '11'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(110,250))&& network === 'WNMX'&& level === '12'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(110,250))&& network === 'WNMX'&& level === '12'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 75,
	      color: "black"
	    };
	  }	if((FromTo(110,250))&& network === 'WNMX'&& level === '12'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 74,
	      color: "black"
	    };
	  }	if((FromTo(215,270))&& network === 'WNMX'&& level === '13'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(215,270))&& network === 'WNMX'&& level === '13'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(110,270))&& network === 'WNMX'&& level === '13'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 77,
	      color: "black"
	    };
	  }	if((FromTo(1,500))&& network === 'WNMX'&& level === '14'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 82,
	      color: "black"
	    };
	  }	if((FromTo(215,270))&& network === 'WNMX'&& level === '14'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 79,
	      color: "black"
	    };
	  }	if((FromTo(215,270))&& network === 'WNMX'&& level === '14'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 78,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'WNMX'&& level === '7'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'WNMX'&& level === '7'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'WNMX'&& level === '7'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 70,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'WNMX'&& level === '8'&& effmu === 'B'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'WNMX'&& level === '8'&& effmu === 'C'&& isNormal) {
	    return {
	      score: 71,
	      color: "black"
	    };
	  }	if((FromTo(61,110))&& network === 'GG'&& level === '6'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 73,
	      color: "black"
	    };
	  }	if((FromTo(1,60))&& network === 'GG'&& level === '6'&& effmu === 'A'&& isNormal && (NotName("sunday forty"))&& network === 'GG'&& level === '6'&& effmu === 'A'&& isNormal) {
	    return {
	      score: 72,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === 'PS.eu'&& level === '0'&& effmu === 'A'&& isSuperTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,5.5))&& network === 'PS.eu'&& level === '0'&& effmu === 'A'&& isTurbo) {
	    return {
	      score: 63,
	      color: "black"
	    };
	  }	if((FromTo(1,5.5))&& network === 'PS.eu'&& level === '0'&& effmu === 'B'&& isTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }	if((FromTo(1,3.5))&& network === 'PS.eu'&& level === '0'&& effmu === 'B'&& isSuperTurbo) {
	    return {
	      score: 61,
	      color: "black"
	    };
	  }
	    
	    
	    return { score: null };
	  };
	  
	  scores_1 = {
	    scores,
	  };
	return scores_1;
}

var scoresExports = requireScores();
var scores = /*@__PURE__*/getDefaultExportFromCjs(scoresExports);

module.exports = scores;
