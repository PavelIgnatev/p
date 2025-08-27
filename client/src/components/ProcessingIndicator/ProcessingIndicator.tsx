import React from "react";
import { useStore } from "effector-react";
import { $isProcessing, $processedCount, $totalCount, $currentStage, $totalStages } from "../../store/Table/state";
import classes from "./ProcessingIndicator.module.scss";

export const ProcessingIndicator = () => {
  const isProcessing = useStore($isProcessing);
  const processedCount = useStore($processedCount);
  const totalCount = useStore($totalCount);
  const currentStage = useStore($currentStage);
  const totalStages = useStore($totalStages);

  if (!isProcessing) {
    return null;
  }

  const progress = totalCount > 0 ? Math.max(1, Math.min(100, Math.round((processedCount / totalCount) * 100))) : 1;

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.title}>Tournament processing ({currentStage}/{totalStages})...</div>
        <div className={classes.progressBar}>
          <div 
            className={classes.progressFill} 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className={classes.stats}>
          {progress}%
        </div>
      </div>
    </div>
  );
};
