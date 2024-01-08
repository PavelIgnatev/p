import { rulesModel } from './../../@types/rulesModel';
import { createEffect } from "effector";
import { scoresModel } from "../../@types/scoreModel";
import api from "../../api";
import { $rulesForUser } from "./state";

export interface UserRulesModel {
  rules: rulesModel[][]
  scores: scoresModel[][]
}

export const getRulesForUser = createEffect(async (userName: string | null) => {
  if(!userName) {
    return null
  }

  const responce = await api.get(`/api/user-rule?alias=${userName}`);

  return responce as UserRulesModel
});

export const postUpdate = createEffect(async () => {
  await api.postUpdate();
});

$rulesForUser.on(getRulesForUser.doneData, (_, rulesForUser) => rulesForUser);
