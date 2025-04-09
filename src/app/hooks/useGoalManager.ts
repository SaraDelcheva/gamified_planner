"use client";

import { useState, useEffect } from "react";
import { GoalI, TodaysHistoryI, NoteI } from "../helpers/interfaces";
import { formatDate, saveData, createDates } from "../helpers/functions";
import { useDiamonds } from "../context/DiamondsContext";

interface UseGoalManagerProps {
  daysToShow: number; // 1 for today's goals, 7 for todo page
}

export function useGoalManager({ daysToShow }: UseGoalManagerProps) {
  const { totalDiamonds, setTotalDiamonds } = useDiamonds();
  const [todaysHistory, setTodaysHistory] = useState<TodaysHistoryI[]>([]);
  const [goals, setGoals] = useState<GoalI[]>([]);
  const [notes, setNotes] = useState<NoteI[]>([]);
  const [goalName, setGoalName] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(0);
  const [goalDate, setGoalDate] = useState("");

  const [newGoalDate, setNewGoalDate] = useState("");
  const [customCoverName, setCustomCoverName] = useState("reward");
  const [customRewardName, setCustomRewardName] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState<{
    [key: string]: boolean;
  }>({});

  const dates = createDates(0, daysToShow);

  // ---------- Data Fetching ----------
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();

      setGoals(Array.isArray(data.goals) ? data.goals : []);
      setTodaysHistory(data.todaysHistory ? data.todaysHistory : []);
      setNotes(data.notes ? data.notes : []);

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
        isCustom,
        date: newGoalDate || formattedDate,
      },
    ];
    setGoals(updatedGoals);
    saveData({ goals: updatedGoals });

    // Reset inputs
    setGoalName("");
    setCustomCoverName("reward");
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
    setCustomCoverName("reward");
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
  }

  // Toggle calendar state
  function toggleCalendar(date: string) {
    setIsCalendarOpen((prev) => {
      const newCalendar = { ...prev };
      Object.keys(prev).forEach((key) => {
        if (key !== date) newCalendar[key] = false;
      });
      newCalendar[date] = !prev[date];
      return newCalendar;
    });
  }

  // Handle date click
  function onClickDay(value: Date) {
    setNewGoalDate(formatDate(value));
  }

  return {
    // State
    todaysHistory,
    goals,
    notes,
    goalName,
    difficulty,
    goalDate,
    newGoalDate,
    customCoverName,
    customRewardName,
    isCustom,
    expanded,
    isCalendarOpen,
    dates,
    totalDiamonds,

    // Setters
    setGoalName,
    setDifficulty,
    setCustomCoverName,
    setCustomRewardName,
    setIsCustom,
    setGoalDate,

    // Functions
    addNewGoal,
    cancelAddGoal,
    completeGoal,
    toggleExpanded,
    toggleCalendar,
    onClickDay,
  };
}
