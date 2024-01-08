const { getScores, saveScores } = require("../../../utils/scores");
const { findInArray } = require("../../../helpers/findInArray");
const { renderScores } = require("../../../modules/renderScores/renderScores");

module.exports = async (req, res) => {
  const { scores: bodyScores } = req.body;
  const scores = await getScores();

  const index = findInArray(scores, bodyScores);

  let isHaveScore = false
  let isNotScore = false
  
  for(let i = 0; i < bodyScores.length; i++) {
    const score = bodyScores[i]

    if(score.color === "orange") {
      isHaveScore = true
      isNotScore = true
      break
    }
    
    if (score.type === "Score") {
      isHaveScore = true
    }
    if(score.type !== "Score") {
      isNotScore = true
    }
  }

  if (!isHaveScore) {
    return res.status(400).send({ message: "The score already must be setted" });
  }
  
  if(isHaveScore && !isNotScore) {
    return res.status(400).send({ message: "Can't add only score rule" });
  }

  if (index !== -1) {
    return res.status(400).send({ message: "The score already exists" });
  }

  scores.push(bodyScores);

  await saveScores([...scores]);
  await renderScores(scores);

  res.status(200).send(scores);
};
