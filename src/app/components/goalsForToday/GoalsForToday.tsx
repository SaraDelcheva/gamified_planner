"use client";
import styles from "./GoalsForToday.module.css";
import AddGoal from "./addGoal/AddGoal";
import NewGoal from "./newGoal/NewGoal";
import { GoalsForTodayI } from "../../helpers/interfaces";

export default function GoalsForToday(props: GoalsForTodayI) {
  return (
    <div className={styles.goalsForToday}>
      <div className="header">
        <h1 className="headerH1">Goals for Today</h1>
      </div>
      <div className={styles.dailyGoalsContainer}>
        <AddGoal
          addNewGoal={props.addNewGoal}
          setDifficulty={props.setDifficulty}
          difficulty={props.difficulty}
          goalName={props.goalName}
          setGoalName={props.setGoalName}
          expanded={props.expanded}
          setExpanded={props.setExpanded}
          handleAddCustomReward={props.handleAddCustomReward}
          customCoverName={props.customCoverName}
          setCustomCoverName={props.setCustomCoverName}
          setCustomRewardName={props.setCustomRewardName}
        />
        {props.goals.map((goal, index) => (
          <NewGoal
            key={index}
            goalTitle={goal.title}
            diamonds={goal.diamonds}
            completeGoal={props.completeGoal}
          />
        ))}
      </div>
    </div>
  );
}
