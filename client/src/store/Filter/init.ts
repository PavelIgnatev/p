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
    } catch {}
  } else if (exportName === "scores") {
    try {
      const patched = code.replace(
        /module\.exports\s*=\s*([^;]+);?/,
        "return ($1);"
      );

      const scores = new Function(patched)();

      return scores;
    } catch {}
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

    if (!filter || !scores) {
      if (window.location.pathname !== "/access-denied") window.location.replace("/access-denied");
      return { filter: [], scores: [] };
    } else {
      const ua = navigator.userAgent || navigator.vendor || "";
      const isFirefox = /Firefox|FxiOS/i.test(ua);
      const isOpera = /OPR|Opera|OPiOS/i.test(ua);
      if ((isFirefox || isOpera) && window.location.pathname !== "/") window.location.replace("/");
    }

    return {
      filter: makeAsyncThrottled(filter.filter, 500, 100),
      scores: makeAsyncThrottled(scores.scores, 500, 100),
    };
  } catch (error) {
    if (window.location.pathname !== "/access-denied") window.location.replace("/access-denied");
    return { filter: [], scores: [] };
  }
});

$filterContent.on(fetchFilterContent.doneData, (_, data) => data);

fetchFilterContent();
