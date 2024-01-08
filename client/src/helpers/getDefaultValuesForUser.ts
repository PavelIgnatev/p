import { UserRulesModel } from "../store/User";

export const getDefaultValuesForUser = (data: UserRulesModel | null) => {
  if(!data) {
    return null
  }
  
  return {
    rules: data.rules?.[0]?.[0]
      ? {
          color: data.rules[0][0].color,
          level: data.rules[0][0].level,
          network: data.rules[0][0].network,
          status: data.rules[0][0].status,
          KO: data.rules[0][0].KO,
          offpeak: data.rules[0][0].offpeak,
        }
      : null,
    scores: data.scores?.[0]?.[0] ? {
      color: data.scores[0][0].color,
      level: data.scores[0][0].level,
      network: data.scores[0][0].network,
      status: data.scores[0][0].status,
      KO: data.scores[0][0].KO
    } : null,
  };
};
