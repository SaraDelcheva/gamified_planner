"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./page.module.css";

import GoalsForToday from "./components/goalsForToday/GoalsForToday";
import PersonalInfo from "./components/personalInfo/PersonalInfo";

import Rewards from "./components/rewards/Rewards";
import { RewardI, GoalI, TodaysHistoryI } from "./helpers/interfaces";
import {
  formatDate,
  saveData,
  claimReward,
  toggleCalendar,
  createDates,
} from "./helpers/functions";

export default function Home() {
  // ---------- State Initialization ----------
  const [totalDiamonds, setTotalDiamonds] = useState<number>(0);
  const [todaysHistory, setTodaysHistory] = useState<TodaysHistoryI[]>([]);

  const [goals, setGoals] = useState<GoalI[]>([]);

  const [goalName, setGoalName] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(0);

  const [goalDate, setGoalDate] = useState("");
  const [newGoalDate, setNewGoalDate] = useState("");

  const [customCoverName, setCustomCoverName] = useState("reward.png");
  const [customRewardName, setCustomRewardName] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const [rewards, setRewards] = useState<RewardI[]>([]);
  const [rewardName, setRewardName] = useState<string>("");
  const [rewardPrice, setRewardPrice] = useState<number | null>(null);
  const [coverName, setCoverName] = useState<string>("reward.png");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState<{
    [key: string]: boolean;
  }>({});

  const dates = createDates(0, 1);

  // ---------- Data Fetching ----------
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();

      setTotalDiamonds(data.totalDiamonds || 0);
      setGoals(Array.isArray(data.goals) ? data.goals : []);
      setRewards(Array.isArray(data.rewards) ? data.rewards : []);
      setTodaysHistory(data.todaysHistory ? data.todaysHistory : []);

      const today = new Date();
      const formattedDate = formatDate(today);
      setGoalDate(formattedDate);
    }

    fetchData();
  }, []);

  // ---------- Handlers for Goal Management ----------
  // Add new goal
  function addNewGoal(formattedDate: string) {
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
        date: newGoalDate ? newGoalDate : formattedDate,
      },
    ];
    setGoals(updatedGoals);
    saveData({ goals: updatedGoals });

    // Reset inputs
    setGoalName("");
    setCustomCoverName("reward.png");
    setCustomRewardName("");
    setExpanded((prev) => ({ ...prev, [formattedDate]: false }));
    setDifficulty(0);
    setIsCustom(false);
    setIsCalendarOpen((prev) => ({ ...prev, [formattedDate]: false }));
    setNewGoalDate("");
  }

  // Cancel adding a goal
  function cancelAddGoal(containerDate: string) {
    setGoalName("");
    setCustomCoverName("reward.png");
    setCustomRewardName("");
    setDifficulty(0);
    setIsCustom(false);
    setExpanded((prev) => ({ ...prev, [containerDate]: false }));
    setIsCalendarOpen((prev) => ({ ...prev, [containerDate]: false }));
    setNewGoalDate("");
  }

  // Complete a goal
  function completeGoal(goalTitle: string) {
    const completedGoal = goals.find((goal) => goal.title === goalTitle);
    if (!completedGoal) return;

    const updatedGoals = goals.filter((goal) => goal.title !== goalTitle);
    setGoals(updatedGoals);
    setTotalDiamonds((prev) => prev + completedGoal.diamonds);

    const newHistory = [
      ...todaysHistory,
      {
        date: dates[0].formattedDate,
        type: "goal",
        title: completedGoal.title,
      },
    ];
    setTodaysHistory(newHistory);

    saveData({
      goals: updatedGoals,
      totalDiamonds: totalDiamonds + completedGoal.diamonds,
      todaysHistory: newHistory,
    });
  }

  // Toggle expanded state
  function toggleExpanded(date: string) {
    setNewGoalDate("");
    setExpanded((prev) => {
      const newExpanded = { [date]: !prev[date] };
      Object.keys(prev).forEach((key) => {
        if (key !== date) newExpanded[key] = false;
      });
      return newExpanded;
    });

    setIsCalendarOpen((prev) => {
      const newCalendar = { ...prev };
      Object.keys(prev).forEach((key) => {
        if (key !== date) newCalendar[key] = !newCalendar[key];
      });
      return newCalendar;
    });
  }

  // Handle date click
  function onClickDay(value: Date) {
    setNewGoalDate(formatDate(value));
  }

  // ---------- Handlers for Reward Management ----------
  //Add a New Reward
  function addNewReward() {
    if (rewardPrice === null || !rewardName.trim()) return;

    const updatedRewards = [
      ...rewards,
      {
        title: rewardName,
        diamonds: rewardPrice,
        isWishListed: false,
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

  //Claim Reward
  function handleClaimReward(e: React.MouseEvent<HTMLButtonElement>) {
    claimReward({
      e,
      rewards,
      totalDiamonds,
      todaysHistory,
      setTodaysHistory,
      setRewards,
      setTotalDiamonds,
      dates,
    });
  }

  //handle is wishlisted
  function handleIsWishListed(e: React.MouseEvent<HTMLDivElement>) {
    const rewardId = e.currentTarget.parentElement?.parentElement?.id;
    const updatedRewards = rewards.map((reward) =>
      reward.id === rewardId
        ? { ...reward, isWishListed: !reward.isWishListed }
        : reward
    );

    setRewards(updatedRewards);
    saveData({ rewards: updatedRewards });
  }

  return (
    <div className={styles.page}>
      {dates.map(({ formattedDate, day }) => (
        <GoalsForToday
          key={formattedDate}
          {...{
            // From GoalsForTodayI
            title: day,
            goals,
            completeGoal,
            totalDiamonds,
            customRewardName,
            setGoalDate,

            // From AddGoalI
            goalName,
            difficulty,
            isCustom,
            customCoverName,
            newGoalDate,
            goalDate: goalDate ? goalDate : formattedDate,

            addNewGoal: () => addNewGoal(formattedDate),
            cancelAddGoal: () => cancelAddGoal(formattedDate),

            setGoalName,
            setDifficulty,
            setIsCustom,
            setCustomCoverName,
            setCustomRewardName,
            setExpanded: () => toggleExpanded(formattedDate),
            setIsCalendarOpen: () =>
              toggleCalendar(setIsCalendarOpen, formattedDate),

            expanded: expanded[formattedDate] || false,
            isCalendarOpen: isCalendarOpen[formattedDate] || false,
            onClickDay,
          }}
        />
      ))}
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
          claimReward: handleClaimReward,
          coverName,
          setCoverName,
          handleIsWishListed,
        }}
      />
      <PersonalInfo
        todaysHistory={todaysHistory}
        rewards={rewards}
        totalDiamonds={totalDiamonds}
        claimReward={handleClaimReward}
        handleIsWishListed={handleIsWishListed}
      />
    </div>
  );
}
