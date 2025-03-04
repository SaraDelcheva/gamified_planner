"use client";
import { AiOutlinePlus } from "react-icons/ai";
import { IoDiamondOutline } from "react-icons/io5";
import styles from "./AddGoal.module.css";
import GoalDifficulty from "./goalDifficulty/GoalDifficulty";
import AddCustomReward from "./addCustomReward/AddCustomReward";
import AddOrCancelBtn from "./addOrCancelBtn/AddOrCancelBtn";

export default function AddGoal({
  addNewGoal,
  setDifficulty,
  difficulty,
  goalName,
  setGoalName,
  expanded,
  setExpanded,
}: {
  addNewGoal: () => void;
  setDifficulty: (diamonds: number) => void;
  setGoalName: (name: string) => void;
  difficulty: number | null;
  goalName: string | null;
  expanded: boolean;
  setExpanded: (value: boolean) => void;
}) {
  function easy(diamonds: number) {
    setDifficulty(diamonds);
  }

  return (
    <div className={`${styles.addGoal} ${expanded ? styles.expanded : ""}`}>
      <div className={styles.addGoalHeader}>
        {!expanded ? (
          <p className={styles.addGoalP}>Add A Goal</p>
        ) : (
          <input
            className={styles.addGoalInput}
            placeholder="Goal Name"
            type="text"
            value={goalName ?? ""}
            onChange={(e) => setGoalName(e.target.value)}
          />
        )}

        {!expanded && (
          <button
            className={`${styles.addBtn} boxShadow`}
            onClick={() => setExpanded(!expanded)}
          >
            <AiOutlinePlus />
          </button>
        )}
        {expanded && difficulty !== null && (
          <button className={`${styles.newBtn} boxShadow`}>
            {difficulty} <IoDiamondOutline />
          </button>
        )}
      </div>

      <div className={styles.expandedContent}>
        <div className={styles.difficultyContainer}>
          <GoalDifficulty easy={easy} difficultyLevel="Easy" diamonds={5} />
          <GoalDifficulty easy={easy} difficultyLevel="Boring" diamonds={10} />
          <GoalDifficulty
            easy={easy}
            difficultyLevel="Difficult"
            diamonds={20}
          />
          <GoalDifficulty
            easy={easy}
            difficultyLevel="Impossible"
            diamonds={30}
          />
        </div>

        <AddCustomReward />
        <AddOrCancelBtn
          addNewGoal={addNewGoal}
          onCancel={() => setExpanded(!expanded)}
        />
      </div>
    </div>
  );
}
