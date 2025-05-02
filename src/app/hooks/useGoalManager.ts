"use client";

import { useState, useEffect } from "react";
import { GoalI, NoteI } from "../helpers/interfaces";
import { formatDate, saveData, createDates } from "../helpers/functions";
import { useDiamonds } from "../context/DiamondsContext";

interface UseGoalManagerProps {
  daysToShow: number; // 1 for today's goals, 7 for todo page
}

export function useGoalManager({ daysToShow }: UseGoalManagerProps) {
  const {
    totalDiamonds,
    todaysHistory,
    setTodaysHistory,
    setTotalBlueGems,
    setTotalGreenGems,
    setTotalPinkGems,
    setTotalRedGems,
    totalBlueGems,
    totalGreenGems,
    totalRedGems,
    totalPinkGems,
  } = useDiamonds();
  const [goals, setGoals] = useState<GoalI[]>([]);
  const [notes, setNotes] = useState<NoteI[]>([]);
  const [goalName, setGoalName] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(0);
  const [goalDate, setGoalDate] = useState("");
  const [rewardCurrency, setRewardCurrency] = useState("blue-gem");

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

  // Handle currency change
  function handleInputCurrencyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    setRewardCurrency(e.target.value.trim() || "blue-gem");
  }

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
              price: isCustom ? 0 : difficulty,
              coverName: isCustom ? customCoverName : "",
              rewardName: isCustom ? customRewardName : "",
              isCustom,
              currency: rewardCurrency,
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
          price: isCustom ? 0 : difficulty,
          coverName: isCustom ? customCoverName : "",
          rewardName: isCustom ? customRewardName : "",
          isCustom,
          currency: rewardCurrency,
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

  //

  // Helper function to reset form state
  function resetForm(containerDate: string) {
    setGoalName("");
    setCustomCoverName("reward");
    setCustomRewardName("");
    setDifficulty(0);
    setRewardCurrency("blue-gem");
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

    const newHistory = [
      ...todaysHistory,
      {
        date: dates[0].formattedDate,
        type: "goal",
        title: completedGoal.title,
      },
    ];
    setTodaysHistory(newHistory);

    let newTotalBlueGems = totalBlueGems;
    let newTotalRedGems = totalRedGems;
    let newTotalGreenGems = totalGreenGems;
    let newTotalPinkGems = totalPinkGems;

    // Update the appropriate gem count
    switch (completedGoal.currency) {
      case "blue-gem":
        newTotalBlueGems += completedGoal.price;
        setTotalBlueGems(newTotalBlueGems);
        break;
      case "red-gem":
        newTotalRedGems += completedGoal.price;
        setTotalRedGems(newTotalRedGems);
        break;
      case "green-gem":
        newTotalGreenGems += completedGoal.price;
        setTotalGreenGems(newTotalGreenGems);
        break;
      case "pink-gem":
        newTotalPinkGems += completedGoal.price;
        setTotalPinkGems(newTotalPinkGems);
        break;
    }
    saveData({
      goals: updatedGoals,
      totalBlueGems: newTotalBlueGems,
      totalRedGems: newTotalRedGems,
      totalGreenGems: newTotalGreenGems,
      totalPinkGems: newTotalPinkGems,
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

    saveData({
      goals: updatedGoals,
    });
  }

  // Start editing a goal
  function editGoal(goalTitle: string) {
    const goalToEdit = goals.find((goal) => goal.title === goalTitle);
    if (!goalToEdit) return;

    // Set form fields with goal data
    setGoalName(goalToEdit.title);
    setDifficulty(goalToEdit.price);
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

  //Remove reminder
  const removeReminder = (noteId: string) => {
    const areYouSure = confirm(
      "Are you sure you want to delete this reminder permanently?"
    );
    if (!areYouSure) return;
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === noteId) {
          const updatedNote = { ...note };
          delete updatedNote.reminder;
          return updatedNote;
        }
        return note;
      })
    );

    saveData({
      notes: notes.map((note) =>
        note.id === noteId ? { ...note, reminder: undefined } : note
      ),
    });
  };

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
    totalRedGems,
    totalBlueGems,
    totalGreenGems,
    totalPinkGems,
    isEditing,
    editingGoalId,
    rewardCurrency,

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
    handleInputCurrencyChange,
    removeReminder,
  };
}
