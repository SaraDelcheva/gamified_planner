"use client";
import { useState, useEffect } from "react";
import styles from "./Todo.module.css";
import GoalsForToday from "../components/goalsForToday/GoalsForToday";
import { GoalI, TodaysHistoryI } from "../helpers/interfaces";
import {
  formatDate,
  saveData,
  toggleCalendar,
  createDates,
} from "../helpers/functions";

export default function Todo() {
  // ---------- State Initialization ----------
  const [totalDiamonds, setTotalDiamonds] = useState<number>(0);
  const [todaysHistory, setTodaysHistory] = useState<TodaysHistoryI[]>([]);

  const [goals, setGoals] = useState<GoalI[]>([]);

  const [goalName, setGoalName] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(0);

  const [goalDate, setGoalDate] = useState("");
  const [newGoalDate, setNewGoalDate] = useState("");

  const [customCoverName, setCustomCoverName] = useState("");
  const [customRewardName, setCustomRewardName] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState<{
    [key: string]: boolean;
  }>({});

  const dates = createDates(7);

  // ---------- Data Fetching ----------
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
        isCustom,
        date: newGoalDate || formattedDate,
      },
    ];
    setGoals(updatedGoals);
    saveData({ goals: updatedGoals });

    // Reset inputs
    setGoalName("");
    setCustomCoverName("reward.png");
    setCustomRewardName("");
    setDifficulty(0);
    setIsCustom(false);
    setExpanded((prev) => ({ ...prev, [formattedDate]: false }));
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
      { type: "goal", title: completedGoal.title },
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

  // ---------- Render ----------
  return (
    <div className={styles.todo}>
      {dates.map(({ formattedDate, dayName }) => (
        <GoalsForToday
          key={formattedDate}
          {...{
            // From GoalsForTodayI
            title: dayName,
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
      ;
    </div>
  );
}
