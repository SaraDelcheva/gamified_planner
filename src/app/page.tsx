"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./page.module.css";
import GoalsForToday from "./components/goalsForToday/GoalsForToday";
import Rewards from "./components/rewards/Rewards";
import { RewardI, GoalI, TodaysHistoryI } from "./helpers/interfaces";
import { formatDate, saveData } from "./helpers/functions";
import PersonalInfo from "./components/personalInfo/PersonalInfo";

export default function Home() {
  const [totalDiamonds, setTotalDiamonds] = useState<number>(0);
  const [rewards, setRewards] = useState<RewardI[]>([]);
  const [goals, setGoals] = useState<GoalI[]>([]);

  const [rewardName, setRewardName] = useState<string>("");

  const [difficulty, setDifficulty] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [goalName, setGoalName] = useState<string>("");
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [rewardPrice, setRewardPrice] = useState<number | null>(null);
  const [coverName, setCoverName] = useState<string>("reward.png");
  const [customCoverName, setCustomCoverName] = useState("reward.png");
  const [customRewardName, setCustomRewardName] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const [goalDate, setGoalDate] = useState("");

  const [todaysHistory, setTodaysHistory] = useState<TodaysHistoryI[]>([]);

  // Fetch all data once
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();

      setTotalDiamonds(data.totalDiamonds || 0);
      setRewards(Array.isArray(data.rewards) ? data.rewards : []);
      setGoals(Array.isArray(data.goals) ? data.goals : []);
      setTodaysHistory(data.todaysHistory ? data.todaysHistory : []);

      const today = new Date();
      const formattedDate = formatDate(today);
      setGoalDate(formattedDate);
    }

    fetchData();
  }, []);

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
        date: goalDate ? goalDate : formattedDate,
      },
    ];
    setGoals(updatedGoals);
    saveData({ goals: updatedGoals });

    setGoalName("");
    setCustomCoverName("reward.png");
    setCustomRewardName("");
    setExpanded((prev) => ({ ...prev, [formattedDate]: false }));
    setDifficulty(0);
    setIsCustom(false);
    setIsCalendarOpen((prev) => ({ ...prev, [formattedDate]: false }));
  }

  //Cancel add goal
  function cancelAddGoal(containerDate: string) {
    setGoalName("");
    setCustomCoverName("reward.png");
    setCustomRewardName("");
    setExpanded((prev) => ({ ...prev, [containerDate]: false }));
    setDifficulty(0);
    setIsCustom(false);
    setIsCalendarOpen((prev) => ({ ...prev, [containerDate]: false }));
  }

  // Complete goal
  function completeGoal(goalTitle: string) {
    const completedGoal = goals.find((goal) => goal.title === goalTitle);
    if (!completedGoal) return;

    const updatedGoals = goals.filter((goal) => goal.title !== goalTitle);
    setGoals(updatedGoals);
    setTotalDiamonds((prev) => prev + completedGoal.diamonds);
    const newHistory = [
      ...todaysHistory,
      { type: "goal", title: completedGoal.title },
    ];
    setTodaysHistory(newHistory);

    saveData({
      goals: updatedGoals,
      totalDiamonds: totalDiamonds + completedGoal.diamonds,
      todaysHistory: newHistory,
    });
  }

  //Add New Reward
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

  //toggle set expanded
  function toggleExpanded(date: string) {
    setExpanded((prev) => {
      const newExpanded = { [date]: !prev[date] };
      Object.keys(prev).forEach((key) => {
        if (key !== date) {
          newExpanded[key] = false;
        }
      });
      return newExpanded;
    });
    setIsCalendarOpen((prev) => {
      const newCalendar = { ...prev };
      Object.keys(prev).forEach((key) => {
        if (key !== date) {
          newCalendar[key] = false;
        }
      });

      return newCalendar;
    });
  }

  //toggle set expanded
  function toggleIsCalendarOpen(date: string) {
    setIsCalendarOpen((prev) => {
      const newCalendar = { [date]: !prev[date] };
      Object.keys(prev).forEach((key) => {
        if (key !== date) {
          newCalendar[key] = false;
        }
      });
      console.log(newCalendar, "new calendar");
      return newCalendar;
    });
  }

  //claim reward
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

    const newHistory = [
      ...todaysHistory,
      {
        type: "reward",
        title: claimedReward[0].title,
        cover: claimedReward[0].cover,
      },
    ];

    setTodaysHistory(newHistory);
    setRewards(updatedRewards);
    setTotalDiamonds(newTotalDiamonds);

    saveData({
      rewards: updatedRewards,
      totalDiamonds: newTotalDiamonds,
      todaysHistory: newHistory,
    });
  }

  //create dates
  const dates = Array.from({ length: 1 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const formattedDate = formatDate(date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    return { formattedDate, dayName };
  });

  //add Date
  function onClickDay(value: Date) {
    const formattedDate = formatDate(value);

    setGoalDate(formattedDate);
  }

  return (
    <div className={styles.page}>
      {dates.map(({ formattedDate, dayName }) => (
        <GoalsForToday
          key={formattedDate}
          {...{
            title: dayName,
            goals,
            totalDiamonds,
            goalName,
            setGoalName,
            expanded: expanded[formattedDate] || false,
            setExpanded: () => toggleExpanded(formattedDate),
            completeGoal,
            difficulty,
            setDifficulty,
            customCoverName,
            setCustomCoverName,
            setCustomRewardName,
            isCustom,
            setIsCustom,
            customRewardName,
            cancelAddGoal: () => cancelAddGoal(formattedDate),
            addNewGoal: () => addNewGoal(formattedDate),
            isCalendarOpen: isCalendarOpen[formattedDate] || false,
            setIsCalendarOpen: () => toggleIsCalendarOpen(formattedDate),
            goalDate: goalDate ? goalDate : formattedDate,
            setGoalDate,
            onClickDay,
            containerDate: formattedDate,
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
          claimReward,
          coverName,
          setCoverName,
        }}
      />
      <PersonalInfo todaysHistory={todaysHistory} />
    </div>
  );
}
