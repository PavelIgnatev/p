
import { scoresModel } from "../../@types/scoreModel";
import { createDomain } from "effector";

import api from "../../api";
import { ErrNot } from "../../components/NotificationService";

import { $scores } from "./state";

const DEFAULT_ERROR_MESSAGE = "An error has occurred. You are denied access to the service.";

const configDomain = createDomain();

export const getScoresRequest = configDomain.createEffect(
  async (params: { color: string; level: string; network: string; status: string; KO: string }) => {
    return await api.get<Array<scoresModel[]>>("/api/scores", params);
  },
);

export const postScoresRequest = configDomain.createEffect(async (scores: scoresModel[]) => {
  await api.postScores(scores);
  await getScoresRequest(scores[0]);
});

export const deleteScoresRequest = configDomain.createEffect(async (score: scoresModel[]) => {
  await api.deleteScores(score);
  await getScoresRequest(score[0]);
});

export const patchScoresRequest = configDomain.createEffect(
  async ({ score, offpeak }: { score: scoresModel[]; offpeak: boolean }) => {
    await api.patchScores(score, offpeak);
    await getScoresRequest(score[0]);
  },
);

configDomain.onCreateEffect((effect) => {
  effect.fail.watch(({ error }: { error: any }) =>
    ErrNot(error?.response?.data?.message || DEFAULT_ERROR_MESSAGE),
  );
});

$scores.on(getScoresRequest.doneData, (_, scores) => scores);
