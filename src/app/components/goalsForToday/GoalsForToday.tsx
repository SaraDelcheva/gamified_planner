"use client";
import styles from "./GoalsForToday.module.css";
import AddGoal from "./addGoal/AddGoal";
import NewGoal from "./newGoal/NewGoal";
import { GoalI } from "../../helpers/interfaces";

export default function GoalsForToday({
  goals,
  totalDiamonds,
  addNewGoal,
  setDifficulty,
  difficulty,
  goalName,
  setGoalName,
  expanded,
  setExpanded,
  completeGoal,
}: {
  goals: GoalI[];
  totalDiamonds: number;
  addNewGoal: () => void;
  setDifficulty: (difficulty: number | null) => void;
  difficulty: number | null;
  goalName: string;
  setGoalName: (name: string) => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  completeGoal: (goalTitle: string) => void;
}) {
  return (
    <div className={styles.goalsForToday}>
      <div className="header">
        <h1 className="headerH1">Goals for Today</h1>
        <div className="headerDiamonds">
          <p>Total Diamonds: {totalDiamonds}</p>
        </div>
      </div>
      <div className={styles.dailyGoalsContainer}>
        <AddGoal
          addNewGoal={addNewGoal}
          setDifficulty={setDifficulty}
          difficulty={difficulty}
          goalName={goalName}
          setGoalName={setGoalName}
          expanded={expanded}
          setExpanded={setExpanded}
        />
        {goals.map((goal, index) => (
          <NewGoal
            key={index}
            goalTitle={goal.title}
            diamonds={goal.diamonds}
            completeGoal={completeGoal}
          />
        ))}
      </div>
    </div>
  );
}
