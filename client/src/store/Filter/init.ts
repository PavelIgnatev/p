import { createEffect } from "effector";

import { $filterContent } from "./state";

import api from "../../api";

export const fetchFilterContent = createEffect(async () => {
  const { filter: frontFilter, scores: frontScores }: any = await api.get("api/filter");

  try {
    // @ts-ignore
    const { filter } = new Function(
      // @ts-ignore
      frontFilter.replace(
        // @ts-ignore
        "module.exports = filter_1;",
        // @ts-ignore
        "return { filter: filter_1};"
        // @ts-ignore
      ).replace(
        // @ts-ignore
        "module.exports = filter$1;",
        // @ts-ignore
        "return { filter: filter_1};"
        // @ts-ignore
      )
      // @ts-ignore
    )();

    // @ts-ignore
    const { scores } = new Function(
      // @ts-ignore
      frontScores.replace(
        // @ts-ignore
        "module.exports = scores_1;",
        // @ts-ignore
        "return { scores: scores_1 };"
        // @ts-ignore
      ).replace(
        // @ts-ignore
        "module.exports = scores$1;",
        // @ts-ignore
        "return { scores: scores_1 };"
        // @ts-ignore
      )
      // @ts-ignore
    )();
        
    return {filter: filter.filter, scores: scores.scores};
  } catch (error) {
    console.log(error);
  }
});

$filterContent.on(fetchFilterContent.doneData, (_, data) => data);

fetchFilterContent();
