const isMystery = (tournament) => {
  const name = (tournament["@name"] ?? "").toLowerCase();

  return !!(
    (tournament["@flags"]?.includes("B") || name?.includes("bounty")) &&
    name?.includes("myster")
  );
};

module.exports = { isMystery }; 