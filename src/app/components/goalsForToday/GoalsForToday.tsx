"use client";
import { useState, useEffect } from "react";
import styles from "./GoalsForToday.module.css";
import AddGoal from "./addGoal/AddGoal";
import NewGoal from "./newGoal/NewGoal";

interface Goal {
  title: string;
  diamonds: number;
}

export default function GoalsForToday({
  setTotalDiamonds,
}: {
  setTotalDiamonds: (total: number) => void;
}) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [goalName, setGoalName] = useState<string>("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function fetchGoals() {
      const res = await fetch("/api/data");
      const data = await res.json();
      if (data?.goals && Array.isArray(data.goals)) setGoals(data.goals);
    }
    fetchGoals();
  }, []);

  async function saveGoalsToJson(updatedGoals: Goal[]) {
    const res = await fetch("/api/data");
    const data = await res.json();

    const newData = {
      ...data,
      goals: updatedGoals,
    };

    await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: newData }),
    });
  }
  async function updateTotalDiamonds(completedGoalDiamonds: number) {
    const res = await fetch("/api/data");
    const data = await res.json();

    let totalDiamonds = data.totalDiamonds || 0;

    totalDiamonds += completedGoalDiamonds;
    setTotalDiamonds(totalDiamonds);

    const newData = {
      ...data,
      totalDiamonds,
    };

    await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: newData }),
    });
  }

  function addNewGoal() {
    if (difficulty === null || !goalName.trim()) return;

    const updatedGoals = [...goals, { title: goalName, diamonds: difficulty }];

    setGoals(updatedGoals);
    setGoalName("");
    setExpanded(false);
    setDifficulty(null);
    saveGoalsToJson(updatedGoals);
  }

  function completeGoal(goalTitle: string) {
    const completedGoal = goals.find((goal) => goal.title === goalTitle);

    if (!completedGoal) {
      return;
    }

    const updatedGoals = goals.filter((goal) => goal.title !== goalTitle);

    setGoals(updatedGoals);
    saveGoalsToJson(updatedGoals);
    updateTotalDiamonds(completedGoal.diamonds);
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
