import { createEffect } from "effector";

import { $filterContent } from "./state";

import api from "../../api";

const parseModuleSafely = async (code: string, exportName: string) => {
  if (exportName === "filter") {
    try {
      const patched = code.replace(
        /module\.exports\s*=\s*([^;]+);?/,
        "return ($1);"
      );

      const filter = new Function(patched)();

      return filter;
    } catch (e) {
      console.log(e);
    }
  } else if (exportName === "scores") {
    try {
      const patched = code.replace(
        /module\.exports\s*=\s*([^;]+);?/,
        "return ($1);"
      );

      const scores = new Function(patched)();

      return scores;
    } catch (e) {
      console.log(e);
    }
  }
  return null;
};

const makeAsyncThrottled =
  <T extends any[], R>(fn: (...a: T) => R, every = 50, delay = 0) =>
  async (...a: T): Promise<R> => {
    if (
      (((makeAsyncThrottled as any).i =
        ((makeAsyncThrottled as any).i | 0) + 1),
      (makeAsyncThrottled as any).i % every === 0)
    )
      await new Promise((r) => setTimeout(r, delay));
    return fn(...a);
  };

export const fetchFilterContent = createEffect(async () => {
  const { filter: frontFilter, scores: frontScores }: any = await api.get(
    "api/filter"
  );

  try {
    const filter = await parseModuleSafely(frontFilter, "filter");
    const scores = await parseModuleSafely(frontScores, "scores");

    console.log(filter, scores, "before");
    if (!filter || !scores) {
      alert(
        "Search functionality is not working in your browser. Please try another browser (Opera, Firefox, Edge)."
      );
      return { filter: [], scores: [] };
    }

    const factFilter = makeAsyncThrottled(filter.filter, 500, 100);
    const factScores = makeAsyncThrottled(scores.scores, 500, 100);

    console.log(factFilter, factScores, "after");
    return {
      filter: factFilter,
      scores: factScores,
    };
  } catch (error) {
    console.log(error);
    alert("Error loading search functionality. Please try another browser.");
    return { filter: [], scores: [] };
  }
});

$filterContent.on(fetchFilterContent.doneData, (_, data) => data);

fetchFilterContent();
