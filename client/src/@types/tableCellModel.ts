export interface tableCellModel {
  "@entrants": number;
  "@prizePool": number;
  "@currentEntrants": string;
  "@lastUpdateTime": string;
  "@reEntries": string;
  "@scheduledStartDate": string;
  "@currency": string;
  "@guarantee": string;
  "@filterString": string;
  "@flags": string;
  "@game": string;
  "@gameClass": string;
  "@id": string;
  "@lateRegEndDate": string;
  "@name": string;
  "@network": string;
  "@playersPerTable": string;
  "@rake": string;
  "@stake": string;
  "@state": string;
  "@structure": string;
  "@totalEntrants": string;
  "@prizepool": string | number;
  "@ko"?: boolean;
  "@duration": string;
  "@timezone": string | undefined;
  "@level": string;
  "@status": string;
  "@date": number | string;
  "@bid": string;
  "@score": string;
  "@realBid": number | string;
  "@turbo": boolean;
  "@rebuy": boolean;
  "@od": boolean;
  "@bounty": boolean;
  "@sat": boolean;
  "@sng": boolean;
  "@deepstack": boolean;
  "@superturbo": boolean;
  "@getWeekday": string;
  "@numberLateRegEndDate": number;
  "@usdBid": number | string;
  "@usdPrizepool": string | number;
  valid: boolean;
}
