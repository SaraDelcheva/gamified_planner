"use client";

import { useState } from "react";
import styles from "./NewGoal.module.css";
import { FaCheck } from "react-icons/fa";
import { MdDeleteForever, MdOutlineEdit } from "react-icons/md";
import { BsExclamationCircleFill, BsStars, BsListTask } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { SubtaskI } from "@/app/helpers/interfaces";
import SubtaskProgress from "../subtaskProgress/SubtaskProgress";

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
  priority,
  subtasks,
  toggleSubtaskCompletion,
  deleteSubtask,
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
  priority: string;
  subtasks?: SubtaskI[];
  toggleSubtaskCompletion?: (goalTitle: string, subtaskId: string) => void;
  deleteSubtask?: (goalTitle: string, subtaskId: string) => void;
}) {
  const [isGoalHovered, setIsGoalHovered] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);

  function getPriorityIcon(priority: string) {
    switch (priority) {
      case "Today's focus":
        return <BsStars color="#FFD700" />;
      case "High Priority":
        return <BsExclamationCircleFill color="#FF4500" />;
      case "Medium Priority":
        return <BsExclamationCircleFill color="#FFA500" />;
      case "Low Priority":
        return <BsExclamationCircleFill color="#90EE90" />;
      case "Optional/Backlog":
        return <BsListTask color="#a0a0a0" />;
      default:
        return null;
    }
  }

  // Function to handle edit click
  const handleEditClick = () => {
    editGoal(goalTitle);
  };

  return (
    <div className={styles.newGoalContainer}>
      <div className={styles.newGoal}>
        <div className={styles.newGoalHeader}>
          <div className={styles.goalTitleContainer}>
            <p className={styles.newGoalP}>
              {getPriorityIcon(priority)} {goalTitle}
            </p>
          </div>
          {isGoalHovered ? (
            <button
              onClick={() => completeGoal(goalTitle)}
              className={`${styles.newBtn} ${styles.completeBtn}`}
              onMouseEnter={() => {
                setIsGoalHovered(true);
              }}
              onMouseLeave={() => {
                setIsGoalHovered(false);
              }}
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
            <button
              className={`${styles.newBtn} ${styles.diamondBtn}`}
              onMouseEnter={() => setIsGoalHovered(true)}
              onMouseLeave={() => setIsGoalHovered(false)}
            >
              {price}{" "}
              <div
                className={styles.gemIcon}
                style={{
                  backgroundImage: `url('/images/${
                    currency || "sapphire"
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
                      currency || "sapphire"
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

        {showSubtasks && subtasks && subtasks.length > 0 && (
          <div className={styles.subtasksList}>
            {subtasks.map((subtask) => (
              <div key={subtask.id} className={styles.subtaskItem}>
                <div className={styles.subtaskLeft}>
                  <input
                    type="checkbox"
                    checked={subtask.isCompleted}
                    onChange={() =>
                      toggleSubtaskCompletion?.(goalTitle, subtask.id)
                    }
                  />
                  <span className={subtask.isCompleted ? styles.completed : ""}>
                    {subtask.title}
                  </span>
                </div>
                <button
                  className={styles.deleteSubtaskBtn}
                  onClick={() => deleteSubtask?.(goalTitle, subtask.id)}
                >
                  <MdDeleteForever />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.deleteEditContainer}>
          <div className={styles.delete} onClick={() => deleteGoal(goalTitle)}>
            <MdDeleteForever />
          </div>
          <div className={styles.edit} onClick={handleEditClick}>
            <MdOutlineEdit />
          </div>
        </div>
      </div>
      {subtasks && subtasks.length > 0 && (
        <button
          className={styles.subtasksToggle}
          onClick={(e) => {
            e.stopPropagation();
            setShowSubtasks(!showSubtasks);
          }}
        >
          <IoIosArrowDown
            className={`${styles.chevron} ${
              showSubtasks ? styles.rotated : ""
            }`}
          />

          <span className={styles.subtaskToggleContent}>
            {/* Circular Progress Diagram */}
            {subtasks.length > 0 && <SubtaskProgress subtasks={subtasks} />}
            Subtasks{" "}
            {subtasks.length > 0 && (
              <>
                ({subtasks.filter((subtask) => subtask.isCompleted).length}/
                {subtasks.length})
              </>
            )}
          </span>
        </button>
      )}
    </div>
  );
}
