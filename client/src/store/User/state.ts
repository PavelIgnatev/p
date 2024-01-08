import { createStore } from "effector";
import { UserRulesModel } from ".";

export const $rulesForUser = createStore<UserRulesModel | null>(null);
