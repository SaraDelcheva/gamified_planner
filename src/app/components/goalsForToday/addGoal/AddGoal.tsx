import { AiOutlinePlus } from "react-icons/ai";
import { IoDiamondOutline } from "react-icons/io5";
import styles from "./AddGoal.module.css";
import GoalDifficulty from "./goalDifficulty/GoalDifficulty";
import AddCustomReward from "./addCustomReward/AddCustomReward";
import AddOrCancelBtn from "./addOrCancelBtn/AddOrCancelBtn";
import { AddGoalI } from "@/app/helpers/interfaces";

export default function AddGoal(props: AddGoalI) {
  function easy(diamonds: number) {
    props.setDifficulty(diamonds);
  }

  return (
    <div
      className={`${styles.addGoal} ${props.expanded ? styles.expanded : ""}`}
    >
      <div className={styles.addGoalHeader}>
        {!props.expanded ? (
          <p className={styles.addGoalP}>Add A Goal</p>
        ) : (
          <input
            className={styles.addGoalInput}
            placeholder="Goal Name"
            type="text"
            value={props.goalName ?? ""}
            onChange={(e) => props.setGoalName(e.target.value)}
          />
        )}

        {!props.expanded && (
          <button
            className={`${styles.addBtn} boxShadow`}
            onClick={() => props.setExpanded(!props.expanded)}
          >
            <AiOutlinePlus />
          </button>
        )}
        {props.expanded && props.difficulty !== null && (
          <button className={`${styles.newBtn} boxShadow`}>
            {props.difficulty} <IoDiamondOutline />
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

        <AddCustomReward
          handleAddCustomReward={props.handleAddCustomReward}
          customCoverName={props.customCoverName}
          setCustomCoverName={props.setCustomCoverName}
          setCustomRewardName={props.setCustomRewardName}
        />
        <AddOrCancelBtn
          addNewGoal={props.addNewGoal}
          onCancel={() => props.setExpanded(!props.expanded)}
        />
      </div>
    </div>
  );
}
