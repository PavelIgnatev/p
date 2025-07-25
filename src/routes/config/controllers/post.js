const { getConfig, saveConfig } = require("../../../utils/config");

const { networks, adminPassword } = require("../../../constants");

module.exports = async (req, res) => {
  // console.log(req.body);
  const {
    config: newConfig,
    password: reqAdminPassword,
    time1,
    time2,
  } = req.body;

  if (reqAdminPassword !== adminPassword) {
    return res.status(403).send({ message: "Wrong password" });
  }

  if (!newConfig) {
    return res.status(403).send({ message: 'Config" parameter is required' });
  }

  const { alias, level, mail, password, timezone } = newConfig;
  if (!mail || level === null || !alias || !password || !timezone) {
    return res.status(403).send({
      message:
        "All parameters are required (mail, level, alias, password, timezone)",
    });
  }

  const config = await getConfig();

  if (config[alias]) {
    return res.status(403).send({ message: "Alias is already in use" });
  }

  config[alias] = {
    alias,
    mail,
    networks: { ko: {}, freezout: {}, mystery: {} },
    password,
    timezone,
    time1,
    time2,
  };

  networks.forEach((network) => {
    config[alias].networks["ko"][network] = { level, effmu: "A" };
    config[alias].networks["freezout"][network] = { level, effmu: "A" };
    config[alias].networks["mystery"][network] = { level, effmu: "A" };
  });

  await saveConfig(config);

  res.status(201).send();
};
