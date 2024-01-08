const { getConfig } = require("../../utils/config");

const get = async (req) => {
  const { level } = req.query;
  const numLevel = !isNaN(Number(level)) ? Number(level) : level;

  const config = await getConfig();
  let aliases = Object.keys(config);

  if (numLevel !== "undefined") {
    aliases = aliases.filter((alias) => {
      if (!config?.[alias]?.networks?.["ko"]) {
        console.log(alias, 'sadsadsa');
      }
      const levels = [
        ...Object.values(config[alias].networks["ko"]),
        ...Object.values(config[alias].networks["freezout"]),
      ].map((network) => network.level);
      return levels.includes(numLevel);
    });
  }

  return aliases;
};

module.exports = { get };
