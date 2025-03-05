"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import GoalsForToday from "./components/goalsForToday/GoalsForToday";
import Rewards from "./components/rewards/Rewards";
import { RewardI, GoalI } from "./helpers/interfaces";

export default function Home() {
  const [totalDiamonds, setTotalDiamonds] = useState<number>(0);
  const [rewards, setRewards] = useState<RewardI[]>([]);
  const [rewardName, setRewardName] = useState<string>("");
  const [coverName, setCoverName] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [imageName, setImageName] = useState<string>("");

  const imageNames: string[] = ["reward.png", "book.png", "coffee.png"];

  // State and data for GoalsForToday
  const [goals, setGoals] = useState<GoalI[]>([]);
  const [goalName, setGoalName] = useState<string>("");
  const [expanded, setExpanded] = useState(false);

  // Fetch data for totalDiamonds, rewards, and goals
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();
      setTotalDiamonds(data.totalDiamonds);
      if (data?.rewards && Array.isArray(data.rewards)) {
        setRewards(data.rewards);
      }
      if (data?.goals && Array.isArray(data.goals)) {
        setGoals(data.goals);
      }
    }

    fetchData();
  }, []);

  // Save updated rewards to the backend
  async function saveRewardsToJson(updatedRewards: RewardI[]) {
    const res = await fetch("/api/data");
    const data = await res.json();

    const newData = {
      ...data,
      rewards: updatedRewards,
    };

    await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: newData }),
    });
  }

  // Save updated goals to the backend
  async function saveGoalsToJson(updatedGoals: GoalI[]) {
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

  // Update total diamonds when completing a goal
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

  // Add new goal
  function addNewGoal() {
    if (difficulty === null || !goalName.trim()) return;

    const updatedGoals = [...goals, { title: goalName, diamonds: difficulty }];
    setGoals(updatedGoals);
    saveGoalsToJson(updatedGoals);
    setGoalName("");
    setExpanded(false);
    setDifficulty(null);
  }

  // Complete goal
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

  const InputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRewardName(e.target.value);
  };

  const DiamondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim() === "" ? null : Number(e.target.value);
    setDifficulty(value);
  };

  function addNewReward() {
    if (difficulty === null || !rewardName.trim()) return;

    const updatedRewards = [
      ...rewards,
      {
        title: rewardName,
        diamonds: difficulty,
        cover: coverName || imageName,
      },
    ];

    setRewards(updatedRewards);
    saveRewardsToJson(updatedRewards);
    setRewardName("");
    setDifficulty(null);
  }

  return (
    <div className={styles.page}>
      <GoalsForToday
        goals={goals}
        totalDiamonds={totalDiamonds}
        addNewGoal={addNewGoal}
        goalName={goalName}
        setGoalName={setGoalName}
        expanded={expanded}
        setExpanded={setExpanded}
        completeGoal={completeGoal}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
      <Rewards
        totalDiamonds={totalDiamonds}
        rewards={rewards}
        rewardName={rewardName}
        difficulty={difficulty}
        isModalOpen={isModalOpen}
        imageName={imageName}
        setCoverName={setCoverName}
        setIsModalOpen={setIsModalOpen}
        setImageName={setImageName}
        imageNames={imageNames}
        InputChange={InputChange}
        DiamondChange={DiamondChange}
        addNewReward={addNewReward}
      />
    </div>
  );
}
