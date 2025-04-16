"use client";

import { useState } from "react";
import styles from "./NewGoal.module.css";
import { IoDiamondOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { BiDiamond } from "react-icons/bi";
import { MdDeleteForever, MdOutlineEdit } from "react-icons/md";

export default function NewGoal({
  goalTitle,
  diamonds,
  completeGoal,
  deleteGoal,
  editGoal,
  isCustom,
  customCoverName,
  customRewardName,
}: {
  goalTitle: string;
  diamonds: number;
  completeGoal: (goalName: string) => void;
  deleteGoal: (goalName: string) => void;
  editGoal: (goalName: string) => void;
  isCustom: boolean;
  customCoverName: string;
  customRewardName: string;
}) {
  const [isGoalHovered, setIsGoalHovered] = useState(false);

  // Function to handle edit click
  const handleEditClick = () => {
    editGoal(goalTitle);
  };

  return (
    <div className={styles.newGoalContainer}>
      <div
        className={styles.newGoal}
        onMouseEnter={() => {
          setIsGoalHovered(true);
        }}
        onMouseLeave={() => {
          setIsGoalHovered(false);
        }}
      >
        <div className={styles.deleteEditContainer}>
          <div className={styles.delete} onClick={() => deleteGoal(goalTitle)}>
            <MdDeleteForever />
          </div>
          <div className={styles.edit} onClick={handleEditClick}>
            <MdOutlineEdit />
          </div>
        </div>
        <div className={styles.newGoalHeader}>
          <p className={styles.newGoalP}>{goalTitle}</p>
          {isGoalHovered ? (
            <button
              onClick={() => completeGoal(goalTitle)}
              className={`${styles.newBtn} ${styles.completeBtn}`}
            >
              <FaCheck />
            </button>
          ) : isCustom ? (
            <button
              className={`${styles.newBtn} ${styles.customBtn}`}
              style={{
                backgroundImage: `url("/images/rewards/${customCoverName}.svg")`,
              }}
              onMouseEnter={() => setIsGoalHovered(true)}
              onMouseLeave={() => setIsGoalHovered(false)}
            ></button>
          ) : (
            <button className={`${styles.newBtn} ${styles.diamondBtn}`}>
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
    </div>
  );
}
