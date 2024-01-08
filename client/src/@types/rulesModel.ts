export type rulesType =
  | "UserName"
  | "FromTo"
  | "FromToName"
  | "BidGt"
  | "Ticket"
  | "BidGtName"
  | "FromToGt"
  | "BidName"
  | "Name"
  // | "ScoreEqual"
  // | "ScoreFrom"
  // | "ScoreTo"
  | "StartRegEqual"
  | "StartRegFrom"
  | "StartRegTo"
  | "NotName"
  | "FLAGS"
  | "StartDay"
  | "Entrants";

export interface rulesModel {
  type: rulesType;
  values: Array<string | number>;
  color: string;
  status: string;
  level: string;
  offpeak: boolean;
  KO: string;
  network: string;
  exceptions?: Array<Array<rulesModel>>
}
