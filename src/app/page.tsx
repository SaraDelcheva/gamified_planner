"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import GoalsForToday from "./components/goalsForToday/GoalsForToday";
import Rewards from "./components/rewards/Rewards";
import { RewardI, GoalI } from "./helpers/interfaces";

export default function Home() {
  const [totalDiamonds, setTotalDiamonds] = useState<number>(0);
  const [rewards, setRewards] = useState<RewardI[]>([]);
  const [goals, setGoals] = useState<GoalI[]>([]);

  const [rewardName, setRewardName] = useState<string>("");
  const [coverName, setCoverName] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [imageName, setImageName] = useState<string>("");
  const [goalName, setGoalName] = useState<string>("");
  const [expanded, setExpanded] = useState(false);

  const imageNames: string[] = ["reward.png", "book.png", "coffee.png"];

  // Fetch all data once
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();

      setTotalDiamonds(data.totalDiamonds || 0);
      setRewards(Array.isArray(data.rewards) ? data.rewards : []);
      setGoals(Array.isArray(data.goals) ? data.goals : []);
    }

    fetchData();
  }, []);

  // Save all updated data at once
  async function saveData(
    updatedData: Partial<{
      totalDiamonds: number;
      rewards: RewardI[];
      goals: GoalI[];
    }>
  ) {
    const res = await fetch("/api/data");
    const data = await res.json();

    const newData = { ...data, ...updatedData };

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
    saveData({ goals: updatedGoals });

    setGoalName("");
    setExpanded(false);
    setDifficulty(null);
  }

  // Complete goal
  function completeGoal(goalTitle: string) {
    const completedGoal = goals.find((goal) => goal.title === goalTitle);
    if (!completedGoal) return;

    const updatedGoals = goals.filter((goal) => goal.title !== goalTitle);
    setGoals(updatedGoals);
    setTotalDiamonds((prev) => prev + completedGoal.diamonds);

    saveData({
      goals: updatedGoals,
      totalDiamonds: totalDiamonds + completedGoal.diamonds,
    });
  }

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
    saveData({ rewards: updatedRewards });

    setRewardName("");
    setDifficulty(null);
  }

  return (
    <div className={styles.page}>
      <GoalsForToday
        {...{
          goals,
          totalDiamonds,
          addNewGoal,
          goalName,
          setGoalName,
          expanded,
          setExpanded,
          completeGoal,
          difficulty,
          setDifficulty,
        }}
      />
      <Rewards
        {...{
          totalDiamonds,
          rewards,
          rewardName,
          difficulty,
          isModalOpen,
          imageName,
          setCoverName,
          setIsModalOpen,
          setImageName,
          imageNames,
          InputChange: (e) => setRewardName(e.target.value),
          DiamondChange: (e) =>
            setDifficulty(
              e.target.value.trim() === "" ? null : Number(e.target.value)
            ),
          addNewReward,
        }}
      />
    </div>
  );
}
