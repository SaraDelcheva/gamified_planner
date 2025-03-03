"use client";
import { useState } from "react";
import styles from "./GoalsForToday.module.css";
import AddGoal from "./addGoal/AddGoal";
import NewGoal from "./newGoal/NewGoal";

export default function GoalsForToday() {
    const [goals, setGoals] = useState([
        { title: "Wash Dishes", diamonds: 19 }
      ]);
    
      const [difficulty, setDifficulty] = useState<number | null>(null); 
      const [goalName, setGoalName] = useState<string>("");
      const [expanded, setExpanded] = useState(false); 

      function addNewGoal() {
        if (difficulty === null || !goalName.trim()) return; 
        setGoals((prevGoals) => [
            ...prevGoals,
            { title: goalName, diamonds: difficulty }
        ]);
        setGoalName(""); 
        setExpanded(false);
      }

    return (
    <div className={styles.goalsForToday}>
        <div className="header">
        <h1 className="headerH1">Goals for Today</h1>
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
          <NewGoal key={index} goalTitle={goal.title} diamonds={goal.diamonds} />
        ))}
        </div>
    </div>
    );
  }