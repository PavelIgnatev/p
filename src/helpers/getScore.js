const mysql = require("mysql");
const { getNetwork } = require("./getNetwork");

const connection = mysql.createConnection({
  host: "vps92230.inmotionhosting.com",
  user: "pocarr5_GameSelectTool",
  password: "ukO4oqdtx8=:%IVm*jzI",
  database: "pocarr5_GameSelectTool",
});

const getScore = () => {
  const networks = {};

  console.log("Начинаю получать score");
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(err);
      }

      const sqlQuery =
        "SELECT * FROM CombinedTournamentData WHERE Tournament_Date >= UNIX_TIMESTAMP(NOW() - INTERVAL 72 HOUR)";

      connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
          reject(error);
        }
        console.log(results);
        results.forEach((tournament) => {
          const network = getNetwork(tournament.Network);

          if (networks[network]) {
            networks[network].push(tournament);
          } else {
            networks[network] = [tournament];
          }
        });

        connection.end((err) => {
          if (err) {
            reject(err);
          }

          console.log("Закончил получать score");
          resolve(networks);
        });
      });
    });
  });
};

module.exports = { getScore };
