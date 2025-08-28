import { createEffect } from "effector";

import { $filterContent } from "./state";

import api from "../../api";

const isFunctionSupported = () => {
  try {
    new Function("return true")();
    return true;
  } catch (error) {
    return false;
  }
};

const checkMobileSupport = () => {
  const functionSupported = isFunctionSupported();

  if (!functionSupported) {
    alert(
      "Search functionality is not supported in your browser. Please try another browser (Chrome, Firefox, Safari, Edge) or update your browser."
    );
  }

  return { functionSupported };
};

const parseModuleSafely = (code: string, exportName: string) => {
  const support = checkMobileSupport();

  if (support.functionSupported) {
    try {
      if (exportName === "filter") {
        // @ts-ignore
        const patched = code.replace(
          /module\.exports\s*=\s*([^;]+);?/,
          "return ($1);"
        );
        const filter = new Function('"use strict";\n' + patched)();

        return filter;
      } else if (exportName === "scores") {
        // @ts-ignore
        const { scores } = new Function(
          // @ts-ignore
          code
            .replace(
              // @ts-ignore
              "module.exports = scores_1;",
              // @ts-ignore
              "return { scores: scores_1 };"
              // @ts-ignore
            )
            .replace(
              // @ts-ignore
              "module.exports = scores$1;",
              // @ts-ignore
              "return { scores: scores_1 };"
              // @ts-ignore
            )
          // @ts-ignore
        )();
        return scores;
      }
    } catch (error) {
      console.warn(`new Function failed for ${exportName}:`, error);
    }
  }

  return null;
};

export const fetchFilterContent = createEffect(async () => {
  const { filter: frontFilter, scores: frontScores }: any = await api.get(
    "api/filter"
  );

  try {
    const filter = parseModuleSafely(frontFilter, "filter");
    const scores = parseModuleSafely(frontScores, "scores");

    if (!filter || !scores) {
      alert(
        "Search functionality is not working in your browser. Please try another browser."
      );
      return { filter: [], scores: [] };
    }

    return { filter: filter.filter, scores: scores.scores };
  } catch (error) {
    alert("Error loading search functionality. Please try another browser.");
    return { filter: [], scores: [] };
  }
});

$filterContent.on(fetchFilterContent.doneData, (_, data) => data);

fetchFilterContent();
