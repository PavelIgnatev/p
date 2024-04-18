import { sampleModel } from "../../@types/sampleModel";
import { createEffect, createApi } from "effector";
import api from "../../api";
import { $sample } from "./state";

export const getPercentScore3 = createEffect(async () => {
  const result = await api.get<sampleModel>("/api/sample");

  return result.count;
});

export const postSample = createEffect(
  async ({ sample }: { sample: string }) => {
    await api.postSample(sample);
  }
);

export const { handleChangeSample } = createApi($sample, {
  handleChangeSample: (_, sample: string) =>
    String(Math.max(0, Math.min(100, Number(sample)))),
});

$sample.on(getPercentScore3.doneData, (_, sample) => sample);

getPercentScore3();
