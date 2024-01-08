import { stopWordsModel } from "./../../@types/stopWords";
import { createEffect } from "effector";
import api from "../../api";
import { $stopWords } from "./state";

export const getStopWords = createEffect(async () => {
  const result = await api.get<stopWordsModel>("/api/stopwords");

  return result;
});

export const postStopWords = createEffect(async (word: string) => {
  await api.postStopWords(word);

  await getStopWords();

  return word;
});

export const deleteStopWords = createEffect(async (word: string) => {
  await api.deleteStopWords(word);

  await getStopWords();

  return word;
});

$stopWords.on(getStopWords.doneData, (_, stopWords) => stopWords);
