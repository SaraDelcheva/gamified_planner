"use client";
import { useState, useEffect } from "react";
import styles from "./Habits.module.css";
import AddNewHabit from "../components/addNewHabit/AddNewHabit";
import RenderHabitDates from "../components/renderHabitDates/RenderHabitDates";
import { HabitI, TodaysHistoryI } from "../helpers/interfaces";
import { formatDate, createDates } from "../helpers/functions";

export default function Habits() {
  const [dates, setDates] = useState<{ formattedDate: string; day: string }[]>(
    []
  );
  const [habits, setHabits] = useState<HabitI[]>([]);
  const [habitName, setHabitName] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [todaysHistory, setTodaysHistory] = useState<TodaysHistoryI[]>([]);

  // Fetch all data once
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();
      setHabits(Array.isArray(data.habits) ? data.habits : []);
      setTodaysHistory(data.todaysHistory ? data.todaysHistory : []);
    }

    fetchData();
  }, []);

  // Save all updated data at once
  async function saveData(
    updatedData: Partial<{
      habits: { title: string }[];
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

  //check consecutive dates
  function getConsecutiveDates(habitDates: { date: string }[]) {
    const completedDates = habitDates.map(
      (habitDate) => new Date(habitDate.date)
    );

    let consecutiveCount = 1;
    let maxConsecutiveCount = 1;
    let latestStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (completedDates[0].getTime() === today.getTime()) {
      latestStreak = 1;
      let prevDate = today.getTime();

      for (let i = 1; i < completedDates.length; i++) {
        const currentDate = completedDates[i];

        if (prevDate - currentDate.getTime() === 24 * 60 * 60 * 1000) {
          latestStreak++;
          prevDate = currentDate.getTime();
        } else {
          break;
        }
      }
    }

    // Calculate the max streak (the longest streak)
    for (let i = 1; i < completedDates.length; i++) {
      const currentDate = completedDates[i - 1];
      const previousDate = completedDates[i];

      const dayDifference =
        (currentDate.getTime() - previousDate.getTime()) / (1000 * 3600 * 24);
      if (dayDifference === 1) {
        consecutiveCount++;
      } else {
        consecutiveCount = 1;
      }
      maxConsecutiveCount = Math.max(maxConsecutiveCount, consecutiveCount);
    }

    return { maxConsecutiveCount, latestStreak };
  }

  //Complete Habit
  function completeHabit(
    index: number | null,
    title: string,
    event: React.MouseEvent
  ) {
    if (index === null) return;

    const clickedDate = event.currentTarget.id.replace(/"/g, "");
    const formattedDate = formatDate(new Date());

    let updatedTodaysHistory = [...todaysHistory];

    const updatedHabits = habits.map((habit) => {
      if (habit.title === title) {
        const existingDateIndex = habit.dates.findIndex(
          (date) => date === clickedDate
        );

        if (existingDateIndex !== -1) {
          // Removing the date
          const updatedDates = habit.dates.filter(
            (date) => date !== clickedDate
          );

          const updatedDatesObjects = updatedDates.map((date) => ({ date }));
          const maxStreak =
            getConsecutiveDates(updatedDatesObjects).maxConsecutiveCount;
          const latestStreak =
            getConsecutiveDates(updatedDatesObjects).latestStreak;

          if (clickedDate === formattedDate) {
            updatedTodaysHistory = updatedTodaysHistory.filter(
              (historyItem) =>
                !(
                  historyItem.date === clickedDate &&
                  historyItem.title === title
                )
            );
          }

          return {
            ...habit,
            latestStreak,
            maxStreak,
            dates: updatedDates,
          };
        } else {
          // Adding the date
          const updatedDates = [...habit.dates, clickedDate].sort((a, b) => {
            return new Date(b).getTime() - new Date(a).getTime();
          });

          const updatedDatesObjects = updatedDates.map((date) => ({ date }));
          const maxStreak =
            getConsecutiveDates(updatedDatesObjects).maxConsecutiveCount;
          const latestStreak =
            getConsecutiveDates(updatedDatesObjects).latestStreak;

          if (clickedDate === formattedDate) {
            // Ensure no duplicates in today's history
            updatedTodaysHistory = [
              ...updatedTodaysHistory.filter(
                (historyItem) =>
                  !(
                    historyItem.date === clickedDate &&
                    historyItem.title === title
                  )
              ),
              { date: clickedDate, type: "habit", title },
            ];
          }

          return {
            ...habit,
            latestStreak,
            maxStreak,
            dates: updatedDates,
          };
        }
      }

      return habit;
    });

    setHabits(updatedHabits);
    setTodaysHistory(updatedTodaysHistory);

    saveData({
      habits: updatedHabits,
      todaysHistory: updatedTodaysHistory,
    });
  }

  // Load initial 17 dates
  useEffect(() => {
    setDates(createDates(0, 17, "backward"));
  }, []);

  // Function to handle scroll
  useEffect(() => {
    const handleScroll = () => {
      if (loading) return;

      const bottom =
        document.documentElement.scrollHeight ===
        document.documentElement.scrollTop + window.innerHeight;

      if (bottom) {
        setLoading(true);

        // Load next 3 dates
        setDates((prevDates) => [
          ...prevDates,
          ...createDates(prevDates.length, 3, "backward"),
        ]);

        setLoading(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  //add New Habit
  function addNewHabit() {
    if (!habitName.trim()) return;

    const updatedHabits = [
      ...habits,
      {
        title: habitName,
        latestStreak: 0,
        maxStreak: 0,
        dates: [],
      },
    ];
    setHabits(updatedHabits);
    saveData({ habits: updatedHabits });
    setHabitName("");
  }

  // cancel Add Habit
  function cancelAddHabit() {
    setIsExpanded(false);
  }

  return (
    <div className={styles.habits}>
      <div className="header">Habits</div>

      <div className={styles.habitsContainer}>
        <div className={styles.dates}>
          {dates.map((date, index) => (
            <div
              key={index}
              className={`${styles.date} ${index === 0 ? styles.today : ""}`}
            >
              <p className={styles.dateText}>{date.formattedDate}</p>
              <p className={styles.dayText}>{date.day}</p>
            </div>
          ))}
        </div>

        <div className={styles.habitsInner}>
          <div className={styles.habitsInner}>
            {habits.map((habit, index) => (
              <div className={styles.habitCard} key={index}>
                <div className={styles.habitName}>
                  {habit.title}
                  <p>Max streak: {habit.maxStreak}</p>
                  <p>Latest streak: {habit.latestStreak}</p>
                </div>
                <div className={styles.habitDates}>
                  <RenderHabitDates
                    habit={habit}
                    completeHabit={completeHabit}
                    dates={dates}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <AddNewHabit
          addNewHabit={addNewHabit}
          habitName={habitName}
          setHabitName={setHabitName}
          cancelAddHabit={cancelAddHabit}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </div>
    </div>
  );
}
