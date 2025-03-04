"use client";

import { useState } from "react";
import styles from "./NewGoal.module.css";
import { IoDiamondOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

export default function NewGoal({
  goalTitle,
  diamonds,
  completeGoal,
}: {
  goalTitle: string;
  diamonds: number;
  completeGoal: (goalName: string) => void;
}) {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div
      className={styles.newGoal}
      onMouseEnter={() => setIsChecked(true)}
      onMouseLeave={() => setIsChecked(false)}
    >
      <div className={styles.newGoalHeader}>
        <p className={styles.newGoalP}>{goalTitle}</p>
        {!isChecked ? (
          <button className={`${styles.newBtn} boxShadow`}>
            {diamonds} <IoDiamondOutline />
          </button>
        ) : (
          <button
            onClick={() => completeGoal(goalTitle)}
            className={`${styles.newBtn} boxShadow`}
          >
            <FaCheck />
          </button>
        )}
      </div>
    </div>
  );
}
