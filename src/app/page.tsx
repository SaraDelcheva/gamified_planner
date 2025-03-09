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
 
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [goalName, setGoalName] = useState<string>("");
  const [expanded, setExpanded] = useState(false);
  const [rewardPrice, setRewardPrice] = useState<number | null>(null);
  const [coverName, setCoverName] = useState<string>("");



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
    if (rewardPrice === null || !rewardName.trim()) return;

    const updatedRewards = [
      ...rewards,
      {
        title: rewardName,
        diamonds: rewardPrice,
        cover: coverName,
      },
    ];
    setRewards(updatedRewards);
    saveData({ rewards: updatedRewards });

    setRewardName("");
    setRewardPrice(null);
  }

  function claimReward(e:React.MouseEvent<HTMLButtonElement>) {
    const claimableRewards = rewards.filter(
      (reward) => reward.diamonds && reward.diamonds <= totalDiamonds
    );
    const button = e.target as HTMLButtonElement;
    const parentElement = button.parentElement; 
//add keys on all rewards and goals
    console.log(parentElement); 
    if (!claimableRewards.length) return;

    const claimedReward = claimableRewards[0];
    const updatedRewards = rewards.filter((reward) => reward !== claimedReward);
    const newTotalDiamonds = totalDiamonds - claimedReward.diamonds!;

    setRewards(updatedRewards);
    setTotalDiamonds(newTotalDiamonds);

    saveData({
      rewards: updatedRewards,
      totalDiamonds: newTotalDiamonds,
    });
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
          rewardPrice,
          isModalOpen,
          setIsModalOpen,
          InputChange: (e) => setRewardName(e.target.value),
          DiamondChange: (e) =>
          {  e.preventDefault();
            setRewardPrice(
              e.target.value.trim() === "" ? null : Number(e.target.value)
            )},
          addNewReward,
          claimReward,
          coverName,
          setCoverName
        }}
      />
    </div>
  );
}
