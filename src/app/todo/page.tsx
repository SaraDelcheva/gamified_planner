"use client";
import { useState, useEffect } from "react";
import styles from "./Todo.module.css";
import GoalsForToday from "../components/goalsForToday/GoalsForToday";
import { RewardI, GoalI, TodaysHistoryI } from "../helpers/interfaces";

export default function Todo() {
  const [totalDiamonds, setTotalDiamonds] = useState<number>(0);
  const [goals, setGoals] = useState<GoalI[]>([]);
  const [difficulty, setDifficulty] = useState<number>(0);
  const [goalName, setGoalName] = useState<string>("");
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [customCoverName, setCustomCoverName] = useState("");
  const [customRewardName, setCustomRewardName] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [todaysHistory, setTodaysHistory] = useState<TodaysHistoryI[]>([]);
  const [goalDate, setGoalDate] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  // const [today, setToday] = useState("");
  // Fetch all data once
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();

      setTotalDiamonds(data.totalDiamonds || 0);
      setGoals(Array.isArray(data.goals) ? data.goals : []);
      setTodaysHistory(data.todaysHistory ? data.todaysHistory : []);
    }
    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(today);
    setGoalDate(formattedDate);
    // setToday(formattedDate);
    fetchData();
  }, []);
  // Save all updated data at once
  async function saveData(
    updatedData: Partial<{
      totalDiamonds: number;
      rewards: RewardI[];
      goals: GoalI[];
      todaysHistory: TodaysHistoryI[];
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
  function addNewGoal(containerDate: string) {
    console.log(containerDate);
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
        date: goalDate,
      },
    ];
    setGoals(updatedGoals);
    saveData({ goals: updatedGoals });

    setGoalName("");
    setCustomCoverName("reward.png");
    setCustomRewardName("");
    setExpanded((prev) => ({ ...prev, [containerDate]: false }));
    setDifficulty(0);
    setIsCustom(false);
  }

  //Cancel add goal
  function cancelAddGoal(containerDate: string) {
    setGoalName("");
    setCustomCoverName("reward.png");
    setCustomRewardName("");
    setDifficulty(0);
    setIsCustom(false);
    setExpanded((prev) => ({ ...prev, [containerDate]: false }));
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
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    return { formattedDate, dayName };
  });

  //add Date
  function onClickDay(value: Date) {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(value);

    setGoalDate(formattedDate);
  }
  //toggle set expanded
  function toggleExpanded(date: string) {
    setExpanded((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  }

  return (
    <div className={styles.todo}>
      {dates.map(({ formattedDate, dayName }) => (
        <div key={formattedDate} className={styles.todoDaily}>
          <div key={formattedDate} className={styles.todoDailyInner}>
            <div id={formattedDate}>
              <GoalsForToday
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
                  isCalendarOpen,
                  setIsCalendarOpen,
                  goalDate: formattedDate,
                  setGoalDate,
                  onClickDay,
                  containerDate: formattedDate,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
