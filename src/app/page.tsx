"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./page.module.css";
import GoalsForToday from "./components/goalsForToday/GoalsForToday";
import Rewards from "./components/rewards/Rewards";
import { RewardI, GoalI } from "./helpers/interfaces";
import PersonalInfo from "./components/personalInfo/PersonalInfo";

export default function Home() {
  const [totalDiamonds, setTotalDiamonds] = useState<number>(0);
  const [rewards, setRewards] = useState<RewardI[]>([]);
  const [goals, setGoals] = useState<GoalI[]>([]);

  const [rewardName, setRewardName] = useState<string>("");

  const [difficulty, setDifficulty] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [goalName, setGoalName] = useState<string>("");
  const [expanded, setExpanded] = useState(false);
  const [rewardPrice, setRewardPrice] = useState<number | null>(null);
  const [coverName, setCoverName] = useState<string>("");
  const [customCoverName, setCustomCoverName] = useState("");
  const [customRewardName, setCustomRewardName] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  // const [todaysHistory, setTodaysHistory] = useState([]);

  // Fetch all data once
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();

      setTotalDiamonds(data.totalDiamonds || 0);
      setRewards(Array.isArray(data.rewards) ? data.rewards : []);
      setGoals(Array.isArray(data.goals) ? data.goals : []);
      // setTodaysHistory(data.todaysHistory ? data.todaysHistory : []);
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
    if (
      (difficulty === 0 && !isCustom) ||
      !goalName.trim() ||
      (!customRewardName && isCustom)
    )
      return;

    const updatedGoals = [
      ...goals,
      {
        title: goalName,
        diamonds: isCustom ? 0 : difficulty,
        coverName: isCustom ? customCoverName : "",
        rewardName: isCustom ? customRewardName : "",
        isCustom: isCustom,
      },
    ];
    setGoals(updatedGoals);
    saveData({ goals: updatedGoals });

    setGoalName("");
    setCustomCoverName("reward.png");
    setCustomRewardName("");
    setExpanded(false);
    setDifficulty(0);
    setIsCustom(false);
    // setTodaysHistory(...todaysHistory, `Completed ${goalName}`);
  }
  //Cancel add goal
  function cancelAddGoal() {
    setGoalName("");
    setCustomCoverName("reward.png");
    setCustomRewardName("");
    setExpanded(false);
    setDifficulty(0);
    setIsCustom(false);
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
        id: uuidv4(),
      },
    ];
    setRewards(updatedRewards);
    saveData({ rewards: updatedRewards });
    setCoverName("reward.png");
    setRewardName("");
    setRewardPrice(null);
  }

  function claimReward(e: React.MouseEvent<HTMLButtonElement>) {
    const claimableRewards = rewards.filter(
      (reward) => reward.diamonds && reward.diamonds <= totalDiamonds
    );
    if (!claimableRewards.length) return;

    const button = e.target as HTMLButtonElement;
    const claimedReward = rewards.filter(
      (reward) => reward.id === button.parentElement?.parentElement?.id
    );
    const updatedRewards = rewards.filter(
      (reward) => reward.id !== claimedReward[0].id
    );
    const newTotalDiamonds = totalDiamonds - claimedReward[0].diamonds!;

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
          customCoverName,
          setCustomCoverName,
          setCustomRewardName,
          isCustom,
          setIsCustom,
          customRewardName,
          cancelAddGoal,
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
          DiamondChange: (e) => {
            e.preventDefault();
            setRewardPrice(
              e.target.value.trim() === "" ? null : Number(e.target.value)
            );
          },
          addNewReward,
          claimReward,
          coverName,
          setCoverName,
        }}
      />
      <PersonalInfo />
    </div>
  );
}
