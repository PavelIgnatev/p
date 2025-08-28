import { createEffect } from "effector";

import { $filterContent } from "./state";

import api from "../../api";

const parseModuleSafely = async (code: string, exportName: string) => {
  if (exportName === "filter") {
    let url: string | null = null;
    try {
      const esm = `const module = { exports: {} };
          const exports = module.exports;
          const process = { env: { NODE_ENV: 'production' } };
          const global = globalThis;
          ${code}
          const __exp = module.exports;
          const __fn  = (typeof __exp === 'function') ? __exp : (__exp && __exp.default);
          export default __exp;
          export const filter = (typeof __exp === 'function') ? __exp : (__exp && __exp.filter) || __fn;
          export const scores = (typeof __exp === 'function') ? __exp : (__exp && __exp.scores) || __fn;`;

      url = URL.createObjectURL(
        new Blob([esm], {
          type: "application/javascript;charset=utf-8",
        })
      );

      if (!url) {
        throw new Error("url not defined");
      }

      const mod = await (0, eval)(`import(${JSON.stringify(url)})`);
      const fn =
        typeof mod[exportName] === "function" ? mod[exportName] : false;

      if (!fn) {
        throw new Error("fn not defined");
      }

      return { filter: fn };
    } catch (e) {
      alert(
        "The browser does not support important features required for the software to function. Without them, the software still works, but less reliably. For example, in Windows, Google Chrome may freeze, while Opera, Firefox and Edge work normally. It is recommended to change your browser."
      );

      try {
        const patched = code.replace(
          /module\.exports\s*=\s*([^;]+);?/,
          "return ($1);"
        );
        const filter = new Function(patched)();

        return filter;
      } catch {}
    } finally {
      setTimeout(() => {
        if (url) URL.revokeObjectURL(url);
      }, 0);
    }
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

export const fetchFilterContent = createEffect(async () => {
  const { filter: frontFilter, scores: frontScores }: any = await api.get(
    "api/filter"
  );

  try {
    const filter = await parseModuleSafely(frontFilter, "filter");
    const scores = await parseModuleSafely(frontScores, "scores");

    if (!filter || !scores) {
      alert(
        "Search functionality is not working in your browser. Please try another browser (Opera, Firefox, Edge)."
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
