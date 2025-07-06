import { tableCellModel } from "../@types/tableCellModel";

export const isMystery = (tournament: tableCellModel) => {
  const name = (tournament["@name"] ?? "").toLowerCase();

  return !!(
    (tournament["@flags"]?.includes("B") || name?.includes("bounty")) &&
    name?.includes("myster")
  );
};
