const { default: axios } = require("axios");

module.exports = async (req, res) => {
  try {
    await axios('http://localhost:81/api/full-update');
  } catch (error) {
    console.log(error);
  }

  res.status(200).send({});
};
