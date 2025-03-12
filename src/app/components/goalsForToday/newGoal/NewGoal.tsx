"use client";

import { useState } from "react";
import styles from "./NewGoal.module.css";
import { IoDiamondOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { BiDiamond } from "react-icons/bi";

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
  const [isGoalHovered, setIsGoalHovered] = useState(false);

  return (
    <div
      className={styles.newGoal}
      onMouseEnter={() => {
        setIsGoalHovered(true);
      }}
      onMouseLeave={() => {
        setIsGoalHovered(false);
      }}
    >
      <div className={styles.newGoalHeader}>
        <p className={styles.newGoalP}>{goalTitle}</p>
        {isGoalHovered ? (
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

        <div
          className={`${styles.customRewardDetails} ${
            isGoalHovered && styles.isHovered
          }`}
        >
          <div className={styles.customRewardDescription}>
            <p className={styles.customRewardDescriptionP}>
              Receive on completion:
            </p>
            <p className={styles.customRewardName}>
              <BiDiamond />
              {isCustom ? <>{customRewardName}</> : <>{diamonds}</>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
