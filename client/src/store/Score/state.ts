
import { scoresModel } from "../../@types/scoreModel";
import { createStore } from "effector";

export const $scores = createStore<Array<scoresModel[]> | null>(null);
