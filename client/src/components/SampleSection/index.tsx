import b_ from "b_";
import { useStore } from "effector-react";
import { $sample, handleChangeSample, postSample } from "../../store/PercentScore3";
import { BaseButton } from "../BaseButton";
import { BaseInputNumber } from "../BaseInputNumber";

import "./index.scss";

export const b = b_.with("percent-section");

export const PercentSection = () => {
  const sample = useStore($sample);

  return (
    <section className={b()}>
      <h2 className={b("title")}>Percent (to calculate the average score):</h2>
      <div className={b("wrapper")}>
        <BaseInputNumber
          value={sample}
          handleChange={handleChangeSample}
          placeholder="Sample"
          className={b("input")}
        />
        <BaseButton
          onClick={() => postSample({ sample })}
          className={b("button")}
        >
          SAVE
        </BaseButton>
      </div>
    </section>
  );
};
