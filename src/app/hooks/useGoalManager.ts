"use client";

import { useState, useEffect } from "react";
import { GoalI, NoteI, SubtaskI } from "../helpers/interfaces";
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
  const [goalDate, setGoalDate] = useState("");

  const [difficulty, setDifficulty] = useState<number>(5);
  const [repeating, setRepeating] = useState<string>("never");
  const [rewardCurrency, setRewardCurrency] = useState<string>("sapphire");
  const [priority, setPriority] = useState<string>("none");

  const [isCompleted, setIsCompleted] = useState(false);
  const [newGoalDate, setNewGoalDate] = useState("");
  const [customCoverName, setCustomCoverName] = useState("reward");
  const [customRewardName, setCustomRewardName] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const [goalNumber, setGoalNumber] = useState<number>(0);
  const [completedGoalNumber, setCompletedGoalNumber] = useState<number>(0);
  const [notCompletedGoalNumber, setNotCompletedGoalNumber] =
    useState<number>(0);
  const [lastTrackedDate, setLastTrackedDate] = useState<string>("");

  // New state to track editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  const dates = createDates(0, daysToShow);
  const todayFormatted = formatDate(new Date());
  const [isTodaysFocus, setIsTodaysFocus] = useState(false);
  const [currentSubtasks, setCurrentSubtasks] = useState<SubtaskI[]>([]);

  // ---------- Data Fetching and Initial Setup ----------
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();

      const loadedGoals = Array.isArray(data.goals) ? data.goals : [];
      setGoals(loadedGoals);
      setNotes(data.notes ? data.notes : []);

      const hasFocusGoal = loadedGoals.some(
        (goal: GoalI) => goal.priority === "Today's focus"
      );
      setIsTodaysFocus(hasFocusGoal);

      const today = new Date();
      const formattedDate = formatDate(today);
      setGoalDate(formattedDate);
      setLastTrackedDate(formattedDate);

      // Handle date change: remove one-time completed goals from previous days
      const cleanedGoals = cleanupPreviousGoals(loadedGoals, formattedDate);
      if (cleanedGoals.length !== loadedGoals.length) {
        setGoals(cleanedGoals);
        saveData({ goals: cleanedGoals });
      }

      // Update goal counts
      updateGoalCounts(cleanedGoals, formattedDate);
    }

    fetchData();
  }, []);

  // Function to cleanup previous goals when date changes
  function cleanupPreviousGoals(
    goalsList: GoalI[],
    currentDate: string
  ): GoalI[] {
    return goalsList.filter((goal) => {
      // Keep all non-completed goals
      if (!goal.isCompleted) return true;

      // Keep completed goals from today
      if (goal.date === currentDate) return true;

      // Keep repeating goals (they should have been updated with a new date already)
      if (goal.repeating !== "never") return true;

      // Remove one-time completed goals from previous days
      return false;
    });
  }

  // ---------- Track date changes ----------
  useEffect(() => {
    const checkDateChange = () => {
      const currentDate = formatDate(new Date());

      // If date has changed since last check
      if (lastTrackedDate && lastTrackedDate !== currentDate) {
        // Clean up previous goals
        const cleanedGoals = cleanupPreviousGoals(goals, currentDate);
        setGoals(cleanedGoals);
        saveData({ goals: cleanedGoals });

        // Update goal counts for the new date
        updateGoalCounts(cleanedGoals, currentDate);

        // Update last tracked date
        setLastTrackedDate(currentDate);
      }
    };

    // Check immediately
    checkDateChange();

    // Set up interval to check date change (every minute)
    const intervalId = setInterval(checkDateChange, 60000);

    return () => clearInterval(intervalId);
  }, [goals, lastTrackedDate]);

  // ---------- Track goal counts ----------
  // Update goal counts whenever goals change
  useEffect(() => {
    updateGoalCounts(goals, todayFormatted);

    // Update isTodaysFocus based on goals
    const hasFocusGoal = goals.some(
      (goal) => goal.priority === "Today's focus"
    );
    setIsTodaysFocus(hasFocusGoal);
  }, [goals]);

  // Function to update goal counts
  function updateGoalCounts(goalsList: GoalI[], currentDate: string) {
    const todaysGoals = goalsList.filter((goal) => goal.date === currentDate);
    const completedGoals = todaysGoals.filter((goal) => goal.isCompleted);
    const notCompletedGoals = todaysGoals.filter((goal) => !goal.isCompleted);

    setGoalNumber(todaysGoals.length);
    setCompletedGoalNumber(completedGoals.length);
    setNotCompletedGoalNumber(notCompletedGoals.length);
  }

  // Consolidated handler for all input changes
  function handleInputChange(
    type: "currency" | "priority" | "difficulty" | "repeat",
    value: string
  ) {
    switch (type) {
      case "currency":
        setRewardCurrency(value.trim() || "sapphire");
        break;

      case "difficulty":
        setDifficulty(Number(value.trim()) || 0);
        break;

      case "repeat":
        setRepeating(value.trim() || "never");
        break;

      case "priority":
        const newPriority = value.trim() || "none";
        if (newPriority === "Today's focus") {
          if (!isTodaysFocus) {
            setIsTodaysFocus(true);
          } else {
            const focusedGoal = confirm(
              "You already have a goal marked as today's focus. Do you want to change it?"
            );
            if (!focusedGoal) {
              return;
            }

            const updatedGoals = goals.map((goal) => {
              if (goal.priority === "Today's focus") {
                return { ...goal, priority: "none" };
              }
              return goal;
            });

            setGoals(updatedGoals);
            saveData({ goals: updatedGoals });
          }
        }
        setPriority(newPriority);
        break;
    }
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
    const targetDate = newGoalDate || formattedDate;

    // If setting this goal as Today's focus, clear any existing focus
    let clearedFocusGoals = [...goals];
    if (priority === "Today's focus") {
      clearedFocusGoals = goals.map((goal) => {
        if (goal.priority === "Today's focus") {
          return { ...goal, priority: "none" };
        }
        return goal;
      });
    }

    if (isEditing && editingGoalId) {
      // Get the current goal to check if we're changing a focus goal
      const currentGoal = goals.find((goal) => goal.title === editingGoalId);
      const wasAFocusGoal = currentGoal?.priority === "Today's focus";
      const isNowFocusGoal = priority === "Today's focus";

      // Update existing goal but preserve subtasks
      updatedGoals = clearedFocusGoals.map((goal) =>
        goal.title === editingGoalId
          ? {
              title: goalName,
              price: isCustom ? 0 : difficulty,
              coverName: isCustom ? customCoverName : "",
              rewardName: isCustom ? customRewardName : "",
              isCustom,
              currency: rewardCurrency,
              date: targetDate,
              repeating: repeating,
              isCompleted: isCompleted,
              priority: priority,
              subtasks: currentSubtasks,
            }
          : goal
      );
      // Update isTodaysFocus if necessary
      if (wasAFocusGoal && !isNowFocusGoal) {
        setIsTodaysFocus(false);
      } else if (!wasAFocusGoal && isNowFocusGoal) {
        setIsTodaysFocus(true);
      }
    } else {
      // Add new goal with empty subtasks array
      updatedGoals = [
        ...clearedFocusGoals,
        {
          title: goalName,
          price: isCustom ? 0 : difficulty,
          coverName: isCustom ? customCoverName : "",
          rewardName: isCustom ? customRewardName : "",
          isCustom,
          currency: rewardCurrency,
          date: targetDate,
          repeating,
          isCompleted: false,
          priority: priority,
          subtasks: currentSubtasks,
        },
      ];

      // Update isTodaysFocus if necessary
      if (priority === "Today's focus") {
        setIsTodaysFocus(true);
      }
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
    setDifficulty(5);
    setRewardCurrency("sapphire");
    setRepeating("");
    setIsCustom(false);
    setExpanded((prev) => ({ ...prev, [containerDate]: false }));
    setIsCalendarOpen((prev) => ({ ...prev, [containerDate]: false }));
    setNewGoalDate("");
    setIsEditing(false);
    setEditingGoalId(null);
    setPriority("");
    setCurrentSubtasks([]);
  }

  // Complete a goal
  function completeGoal(goalTitle: string) {
    const completedGoal = goals.find((goal) => goal.title === goalTitle);
    if (!completedGoal) return;

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
      case "sapphire":
        newTotalBlueGems += completedGoal.price;
        setTotalBlueGems(newTotalBlueGems);
        break;
      case "ruby":
        newTotalRedGems += completedGoal.price;
        setTotalRedGems(newTotalRedGems);
        break;
      case "emerald":
        newTotalGreenGems += completedGoal.price;
        setTotalGreenGems(newTotalGreenGems);
        break;
      case "crystal":
        newTotalPinkGems += completedGoal.price;
        setTotalPinkGems(newTotalPinkGems);
        break;
    }

    let updatedGoals;

    if (completedGoal.repeating === "never") {
      // For non-repeating goals, mark as completed but keep it until date changes
      updatedGoals = goals.map((goal) =>
        goal.title === goalTitle ? { ...goal, isCompleted: true } : goal
      );
    } else {
      const nextDate = calculateNextDate(
        completedGoal.date,
        completedGoal.repeating
      );

      // Update the goal with new date and reset completion status
      updatedGoals = goals.map((goal) =>
        goal.title === goalTitle
          ? { ...goal, date: nextDate, isCompleted: false }
          : goal
      );
    }

    // Check if the completed goal was today's focus
    const wasFocusGoal = completedGoal.priority === "Today's focus";

    // If completed a non-repeating focus goal, update isTodaysFocus
    if (wasFocusGoal && completedGoal.repeating === "never") {
      setIsTodaysFocus(false);
    }

    setGoals(updatedGoals);

    saveData({
      goals: updatedGoals,
      totalBlueGems: newTotalBlueGems,
      totalRedGems: newTotalRedGems,
      totalGreenGems: newTotalGreenGems,
      totalPinkGems: newTotalPinkGems,
      todaysHistory: newHistory,
    });
  }

  // Calculate the next date for repeating goals
  function calculateNextDate(
    currentDate: string,
    repeatingType: string
  ): string {
    const date = new Date(currentDate);

    switch (repeatingType) {
      case "daily":
        // Add one day
        date.setDate(date.getDate() + 1);
        break;
      case "weekly":
        // Add one week
        date.setDate(date.getDate() + 7);
        break;
      case "monthly":
        // Add one month
        date.setMonth(date.getMonth() + 1);
        break;
      default:
        // Should not happen, but return original date as fallback
        return currentDate;
    }

    return formatDate(date);
  }

  // Delete goal
  function deleteGoal(goalTitle: string) {
    if (!confirm("Are you sure you want to delete this goal permanently?"))
      return;

    // Check if deleting a focus goal
    const goalToDelete = goals.find((goal) => goal.title === goalTitle);
    const isDeletingFocusGoal = goalToDelete?.priority === "Today's focus";

    const updatedGoals = goals.filter((goal) => goal.title !== goalTitle);
    setGoals(updatedGoals);

    // Update isTodaysFocus if necessary
    if (isDeletingFocusGoal) {
      setIsTodaysFocus(false);
    }

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
    setRepeating(goalToEdit.repeating);
    setIsCompleted(goalToEdit.isCompleted);
    setRewardCurrency(goalToEdit.currency || "sapphire");
    setPriority(goalToEdit.priority || "none");
    setCurrentSubtasks(goalToEdit.subtasks || []);

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

  // Remove reminder
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

  // ----- SUBTASK FUNCTIONS -----
  // Add a subtask to a goal
  function addSubtask(goalTitle: string, subtaskTitle: string) {
    if (!subtaskTitle.trim()) return;

    const newSubtask: SubtaskI = {
      id: generateSubtaskId(),
      title: subtaskTitle.trim(),
      isCompleted: false,
    };

    const updatedGoals = goals.map((goal) => {
      if (goal.title === goalTitle) {
        const updatedSubtasks = [...(goal.subtasks || []), newSubtask];
        return {
          ...goal,
          subtasks: updatedSubtasks,
        };
      }
      return goal;
    });

    setGoals(updatedGoals);
    saveData({ goals: updatedGoals });
  }

  // Toggle subtask completion
  function toggleSubtaskCompletion(goalTitle: string, subtaskId: string) {
    const updatedGoals = goals.map((goal) => {
      if (goal.title === goalTitle) {
        const updatedSubtasks = (goal.subtasks || []).map((subtask) =>
          subtask.id === subtaskId
            ? { ...subtask, isCompleted: !subtask.isCompleted }
            : subtask
        );
        return {
          ...goal,
          subtasks: updatedSubtasks,
        };
      }
      return goal;
    });

    setGoals(updatedGoals);
    saveData({ goals: updatedGoals });
  }

  // Delete a subtask
  function deleteSubtask(goalTitle: string, subtaskId: string) {
    const updatedGoals = goals.map((goal) => {
      if (goal.title === goalTitle) {
        const updatedSubtasks = (goal.subtasks || []).filter(
          (subtask) => subtask.id !== subtaskId
        );
        return {
          ...goal,
          subtasks: updatedSubtasks,
        };
      }
      return goal;
    });

    setGoals(updatedGoals);
    saveData({ goals: updatedGoals });
  }

  // Generate a unique ID for subtasks
  function generateSubtaskId(): string {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
  }

  // Add a subtask to the current goal being edited
  function addCurrentSubtask(subtaskTitle: string) {
    if (!subtaskTitle.trim()) return;

    const newSubtask: SubtaskI = {
      id: generateSubtaskId(),
      title: subtaskTitle.trim(),
      isCompleted: false,
    };

    setCurrentSubtasks((prev) => [...prev, newSubtask]);
  }

  // Toggle completion of a current subtask
  function toggleCurrentSubtaskCompletion(subtaskId: string) {
    setCurrentSubtasks((prev) =>
      prev.map((subtask) =>
        subtask.id === subtaskId
          ? { ...subtask, isCompleted: !subtask.isCompleted }
          : subtask
      )
    );
  }

  // Delete a current subtask
  function deleteCurrentSubtask(subtaskId: string) {
    setCurrentSubtasks((prev) =>
      prev.filter((subtask) => subtask.id !== subtaskId)
    );
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
    totalRedGems,
    totalBlueGems,
    totalGreenGems,
    totalPinkGems,
    isEditing,
    editingGoalId,
    rewardCurrency,
    repeating,
    goalNumber,
    completedGoalNumber,
    notCompletedGoalNumber,
    priority,
    isTodaysFocus,
    currentSubtasks,

    // Setters
    setGoalName,
    setDifficulty,
    setCustomCoverName,
    setCustomRewardName,
    setIsCustom,
    setGoalDate,
    setRepeating,
    setExpanded,
    setIsCalendarOpen,

    // Functions
    addNewGoal,
    cancelAddGoal,
    completeGoal,
    deleteGoal,
    editGoal,
    toggleExpanded,
    toggleCalendar,
    onClickDay,
    handleInputChange,
    removeReminder,

    // Subtask functions
    addSubtask,
    toggleSubtaskCompletion,
    deleteSubtask,
    addCurrentSubtask,
    toggleCurrentSubtaskCompletion,
    deleteCurrentSubtask,
  };
}
