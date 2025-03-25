"use client";
import { useState, useEffect } from "react";
import styles from "./Todo.module.css";
import GoalsForToday from "../components/goalsForToday/GoalsForToday";
import { GoalI, TodaysHistoryI } from "../helpers/interfaces";
import { formatDate, saveData } from "../helpers/functions";

export default function Todo() {
  const [totalDiamonds, setTotalDiamonds] = useState<number>(0);
  const [goals, setGoals] = useState<GoalI[]>([]);
  const [difficulty, setDifficulty] = useState<number>(0);
  const [goalName, setGoalName] = useState<string>("");
  const [customCoverName, setCustomCoverName] = useState("");
  const [customRewardName, setCustomRewardName] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [todaysHistory, setTodaysHistory] = useState<TodaysHistoryI[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [goalDate, setGoalDate] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState<{
    [key: string]: boolean;
  }>({});

  // Fetch all data once
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();

      setTotalDiamonds(data.totalDiamonds || 0);
      setGoals(Array.isArray(data.goals) ? data.goals : []);
      setTodaysHistory(data.todaysHistory ? data.todaysHistory : []);
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
    setDifficulty(0);
    setIsCustom(false);
    setExpanded((prev) => ({ ...prev, [containerDate]: false }));
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

  //create dates
  const dates = Array.from({ length: 7 }, (_, i) => {
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

  return (
    <div className={styles.todo}>
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
      ;
    </div>
  );
}
