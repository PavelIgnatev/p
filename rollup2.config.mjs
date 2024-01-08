import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/modules/filter/scores.js",
  output: {
    file: "src/modules/filter/frontScores.js",
    format: "cjs",
  },
  plugins: [resolve(), commonjs()],
};
