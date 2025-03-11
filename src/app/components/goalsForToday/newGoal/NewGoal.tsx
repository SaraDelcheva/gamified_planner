"use client";

import { useState } from "react";
import styles from "./NewGoal.module.css";
import { IoDiamondOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

export default function NewGoal({
  goalTitle,
  diamonds,
  completeGoal,
  isCustom,
  customCoverName,
  customRewardName,
}: {
  goalTitle: string;
  diamonds: number;
  completeGoal: (goalName: string) => void;
  isCustom: boolean;
  customCoverName: string;
  customRewardName: string;
}) {
  const [isChecked, setIsChecked] = useState(false);
  const [isGoalHovered, setIsGoalHovered] = useState(false);
  return (
    <div
      className={styles.newGoal}
      onMouseEnter={() => {
        setIsChecked(true);
        if (isCustom) setIsGoalHovered(true);
      }}
      onMouseLeave={() => {
        setIsChecked(false);
        if (isCustom) setIsGoalHovered(false);
      }}
    >
      <div className={styles.newGoalHeader}>
        <p className={styles.newGoalP}>{goalTitle}</p>
        {isChecked ? (
          <button
            onClick={() => completeGoal(goalTitle)}
            className={`${styles.newBtn} boxShadow`}
          >
            <FaCheck />
          </button>
        ) : isCustom ? (
          <button
            className={`${styles.newBtn} boxShadow`}
            style={{ backgroundImage: `url("/images/${customCoverName}")` }}
            onMouseEnter={() => setIsGoalHovered(true)}
            onMouseLeave={() => setIsGoalHovered(false)}
          ></button>
        ) : (
          <button className={`${styles.newBtn} boxShadow`}>
            {diamonds} <IoDiamondOutline />
          </button>
        )}
        {isGoalHovered && (
          <div className={styles.customRewardDescription}>
            {customRewardName}
          </div>
        )}
      </div>
    </div>
  );
}
