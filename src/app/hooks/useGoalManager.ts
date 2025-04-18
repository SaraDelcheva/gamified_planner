"use client";

import { useState, useEffect } from "react";
import { GoalI, NoteI } from "../helpers/interfaces";
import { formatDate, saveData, createDates } from "../helpers/functions";
import { useDiamonds } from "../context/DiamondsContext";

interface UseGoalManagerProps {
  daysToShow: number; // 1 for today's goals, 7 for todo page
}

export function useGoalManager({ daysToShow }: UseGoalManagerProps) {
  const { totalDiamonds, setTotalDiamonds, todaysHistory, setTodaysHistory } =
    useDiamonds();
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

  // New state to track editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  const dates = createDates(0, daysToShow);

  // ---------- Data Fetching ----------
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();

      setGoals(Array.isArray(data.goals) ? data.goals : []);

      setNotes(data.notes ? data.notes : []);

      const today = new Date();
      const formattedDate = formatDate(today);
      setGoalDate(formattedDate);
    }

    fetchData();
  }, []);

  // ---------- Handlers for Goal Management ----------
  // Add new goal or update existing goal
  function addNewGoal(formattedDate: string) {
    if (
      (difficulty === 0 && !isCustom) ||
      !goalName.trim() ||
      (!customRewardName && isCustom)
    )
      return;

    let updatedGoals;

    if (isEditing && editingGoalId) {
      // Update existing goal
      updatedGoals = goals.map((goal) =>
        goal.title === editingGoalId
          ? {
              title: goalName,
              diamonds: isCustom ? 0 : difficulty,
              coverName: isCustom ? customCoverName : "",
              rewardName: isCustom ? customRewardName : "",
              isCustom,
              date: newGoalDate || formattedDate,
            }
          : goal
      );
    } else {
      // Add new goal
      updatedGoals = [
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
    }

    setGoals(updatedGoals);
    saveData({ goals: updatedGoals });

    // Reset inputs and editing state
    resetForm(formattedDate);
  }

  // Cancel adding/editing a goal
  function cancelAddGoal(containerDate: string) {
    resetForm(containerDate);
  }

  // Helper function to reset form state
  function resetForm(containerDate: string) {
    setGoalName("");
    setCustomCoverName("reward");
    setCustomRewardName("");
    setDifficulty(0);
    setIsCustom(false);
    setExpanded((prev) => ({ ...prev, [containerDate]: false }));
    setIsCalendarOpen((prev) => ({ ...prev, [containerDate]: false }));
    setNewGoalDate("");
    setIsEditing(false);
    setEditingGoalId(null);
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

  // Delete goal
  function deleteGoal(goalTitle: string) {
    if (!confirm("Are you sure you want to delete this goal permanently?"))
      return;
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

  // Start editing a goal
  function editGoal(goalTitle: string) {
    const goalToEdit = goals.find((goal) => goal.title === goalTitle);
    if (!goalToEdit) return;

    // Set form fields with goal data
    setGoalName(goalToEdit.title);
    setDifficulty(goalToEdit.diamonds);
    setIsCustom(goalToEdit.isCustom);
    setCustomCoverName(goalToEdit.coverName || "reward");
    setCustomRewardName(goalToEdit.rewardName || "");
    setNewGoalDate(goalToEdit.date);

    // Set editing state
    setIsEditing(true);
    setEditingGoalId(goalTitle);

    // Expand the form for the day of the goal
    setExpanded((prev) => ({ ...prev, [goalToEdit.date]: true }));
  }

  // Toggle expanded state
  function toggleExpanded(date: string) {
    // If we're currently editing, don't collapse the form
    if (isEditing) return;

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
    isEditing,
    editingGoalId,

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
    deleteGoal,
    editGoal,
    toggleExpanded,
    toggleCalendar,
    onClickDay,
  };
}
