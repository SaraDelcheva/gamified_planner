"use client";
import { useState, useEffect } from "react";
import styles from "./Habits.module.css";
import AddNewHabit from "../components/addNewHabit/AddNewHabit";
import RenderHabitDates from "../components/renderHabitDates/RenderHabitDates";
import { HabitI, TodaysHistoryI } from "../helpers/interfaces";

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
  function getConsecutiveDates(
    habitDates: { date: string; isComplete: boolean }[]
  ) {
    const completedDates = habitDates
      .filter((dateObj) => dateObj.isComplete)
      .map((dateObj) => new Date(dateObj.date));

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

    const updatedHabits = habits.map((habit) => {
      if (habit.title === title) {
        const existingDateIndex = habit.dates.findIndex(
          (dateObj) => dateObj.date === clickedDate
        );

        if (existingDateIndex !== -1) {
          const updatedDates = habit.dates.filter(
            (dateObj) => dateObj.date !== clickedDate
          );
          const maxStreak =
            getConsecutiveDates(updatedDates).maxConsecutiveCount;
          const latestStreak = getConsecutiveDates(updatedDates).latestStreak;

          return {
            ...habit,
            latestStreak,
            maxStreak,
            dates: updatedDates,
          };
        } else {
          const newDate = { date: clickedDate, isComplete: true };
          const updatedDates = [...habit.dates, newDate].sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          const maxStreak =
            getConsecutiveDates(updatedDates).maxConsecutiveCount;
          const latestStreak = getConsecutiveDates(updatedDates).latestStreak;

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
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date());
    if (clickedDate === formattedDate) {
      setTodaysHistory([...todaysHistory, { type: "habit", title: title }]);
    }
    setHabits(updatedHabits);
    saveData({ habits: updatedHabits, todaysHistory: todaysHistory });
  }

  //Generate dates

  const generateDates = (startIndex: number, count: number) => {
    const today = new Date();
    const tempDates = [];

    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (startIndex + i));

      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);

      const day = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
      }).format(date);

      tempDates.push({ formattedDate, day });
    }

    return tempDates;
  };

  // Load initial 17 dates
  useEffect(() => {
    setDates(generateDates(0, 17));
  }, []);

  // Function to handle scroll
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
        ...generateDates(prevDates.length, 3),
      ]);

      setLoading(false);
    }
  };

  useEffect(() => {
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
