"use client";

import { useState } from "react";
import styles from "./NewGoal.module.css";
import { FaCheck } from "react-icons/fa";
import { MdDeleteForever, MdOutlineEdit } from "react-icons/md";

export default function NewGoal({
  goalTitle,
  price,
  currency,
  completeGoal,
  deleteGoal,
  editGoal,
  isCustom,
  customCoverName,
  customRewardName,
}: {
  goalTitle: string;
  price: number;
  currency: string;
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
              {price}{" "}
              <div
                className={styles.gemIcon}
                style={{
                  backgroundImage: `url('/images/${
                    currency || "blue-gem"
                  }.svg')`,
                  width: "15px",
                  height: "15px",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  marginLeft: "5px",
                }}
              ></div>
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
              <div className={styles.customRewardName}>
                <div
                  className={styles.gemIcon}
                  style={{
                    backgroundImage: `url('/images/${
                      currency || "blue-gem"
                    }.svg')`,
                    width: "10px",
                    height: "10px",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    marginLeft: "5px",
                  }}
                ></div>
                {isCustom ? <>{customRewardName}</> : <>{price}</>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
