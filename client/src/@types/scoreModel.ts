export type scoreType =
  | "FromTo"
  | "FromToName"
  | "BidGt"
  | "Ticket"
  | "BidGtName"
  | "FromToGt"
  | "BidName"
  | "Name"
  | "Score"
  | "NotName"
  | "FLAGS"
  | "StartDay"
  | "UserName"
  | "Entrants";

export interface scoresModel {
  type: scoreType;
  values: Array<string | number>;
  color: string;
  status: string;
  level: string;
  KO: string;
  network: string;
  exceptions?: Array<Array<scoresModel>>;
}
