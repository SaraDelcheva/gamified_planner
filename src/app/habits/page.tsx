"use client";
import { useState, useEffect } from "react";
import styles from "./Habits.module.css";
import AddNewHabit from "../components/addNewHabit/AddNewHabit";
import RenderHabitDates from "../components/renderHabitDates/RenderHabitDates";
import { HabitI, TodaysHistoryI } from "../helpers/interfaces";
import { formatDate, createDates } from "../helpers/functions";

interface UpdatedData {
  habits?: { title: string }[];
  todaysHistory?: TodaysHistoryI[];
}

export default function Habits() {
  const [dates, setDates] = useState<{ formattedDate: string; day: string }[]>(
    []
  );
  const [habits, setHabits] = useState<HabitI[]>([]);
  const [habitName, setHabitName] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [todaysHistory, setTodaysHistory] = useState<TodaysHistoryI[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/data");
        const data = await res.json();
        setHabits(Array.isArray(data.habits) ? data.habits : []);
        setTodaysHistory(data.todaysHistory ?? []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Save data handler
  const saveData = async (updatedData: UpdatedData) => {
    try {
      const res = await fetch("/api/data");
      const data = await res.json();
      const newData = { ...data, ...updatedData };

      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newData }),
      });
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  // Calculate consecutive dates
  const getConsecutiveDates = (habitDates: { date: string }[]) => {
    const completedDates = habitDates.map(
      (habitDate) => new Date(habitDate.date)
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let consecutiveCount = 1;
    let maxConsecutiveCount = 1;
    let latestStreak = 0;

    // Calculate latest streak
    if (completedDates[0]?.getTime() === today.getTime()) {
      latestStreak = 1;
      let prevDate = today.getTime();

      for (let i = 1; i < completedDates.length; i++) {
        const currentDate = completedDates[i];
        if (prevDate - currentDate.getTime() === 24 * 60 * 60 * 1000) {
          latestStreak++;
          prevDate = currentDate.getTime();
        } else break;
      }
    }

    // Calculate max streak
    for (let i = 1; i < completedDates.length; i++) {
      const dayDifference =
        (completedDates[i - 1].getTime() - completedDates[i].getTime()) /
        (1000 * 3600 * 24);
      consecutiveCount = dayDifference === 1 ? consecutiveCount + 1 : 1;
      maxConsecutiveCount = Math.max(maxConsecutiveCount, consecutiveCount);
    }

    return { maxConsecutiveCount, latestStreak };
  };

  // Handle habit completion
  const completeHabit = (
    index: number | null,
    title: string,
    event: React.MouseEvent
  ) => {
    if (index === null) return;

    const clickedDate = event.currentTarget.id.replace(/"/g, "");
    const formattedDate = formatDate(new Date());
    let updatedTodaysHistory = [...todaysHistory];

    const updatedHabits = habits.map((habit) => {
      if (habit.title !== title) return habit;

      const existingDateIndex = habit.dates.findIndex(
        (date) => date === clickedDate
      );
      const isRemoving = existingDateIndex !== -1;

      const updatedDates = isRemoving
        ? habit.dates.filter((date) => date !== clickedDate)
        : [...habit.dates, clickedDate].sort(
            (a, b) => new Date(b).getTime() - new Date(a).getTime()
          );

      const { maxConsecutiveCount: maxStreak, latestStreak } =
        getConsecutiveDates(updatedDates.map((date) => ({ date })));

      if (clickedDate === formattedDate) {
        updatedTodaysHistory = isRemoving
          ? updatedTodaysHistory.filter(
              (item) => !(item.date === clickedDate && item.title === title)
            )
          : [
              ...updatedTodaysHistory.filter(
                (item) => !(item.date === clickedDate && item.title === title)
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
    });

    setHabits(updatedHabits);
    setTodaysHistory(updatedTodaysHistory);
    saveData({ habits: updatedHabits, todaysHistory: updatedTodaysHistory });
  };

  // Load initial dates
  useEffect(() => {
    setDates(createDates(0, 17, "backward"));
  }, []);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (loading) return;

      const isBottom =
        document.documentElement.scrollHeight ===
        document.documentElement.scrollTop + window.innerHeight;

      if (isBottom) {
        setLoading(true);
        setDates((prevDates) => [
          ...prevDates,
          ...createDates(prevDates.length, 3, "backward"),
        ]);
        setLoading(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  // Add new habit
  const addNewHabit = () => {
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
  };

  // Cancel adding habit
  const cancelAddHabit = () => setIsExpanded(false);

  return (
    <div className={styles.habits}>
      <div className={styles.padding}></div>
      <div className={styles.habitsContainer}>
        <div className={styles.dates}>
          {dates.map((date, index) => (
            <div
              key={index}
              className={`${styles.date} ${index === 0 ? styles.today : ""}`}
            >
              <p className={styles.dateText}>{date.formattedDate}</p>
            </div>
          ))}
        </div>

        <div className={styles.habitsInner}>
          <div className={styles.habitsInner}>
            {habits.map((habit, index) => (
              <div className={styles.habitCard} key={index}>
                <div className={styles.habitName}>
                  {habit.title}
                  <p>Latest streak: {habit.latestStreak}</p>
                  <p>Max streak: {habit.maxStreak}</p>
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
