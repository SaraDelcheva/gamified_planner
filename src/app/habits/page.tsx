"use client";
import { useState, useEffect } from "react";
import styles from "./Habits.module.css";
import AddNewHabit from "../components/addNewHabit/AddNewHabit";
import HabitCard from "../components/habitCard/HabitCard";
import { HabitI } from "../helpers/interfaces";

export default function Habits() {
  const [dates, setDates] = useState<{ formattedDate: string; day: string }[]>(
    []
  );
  const [habits, setHabits] = useState<HabitI[]>([]);
  const [habitName, setHabitName] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  //Complete Habit
  function completeHabit(
    index: number | null,
    title: string,
    event: React.MouseEvent
  ) {
    if (index === null) return;

    const clickedDate = event.currentTarget.id;

    const updatedHabits = habits.map((habit) => {
      if (habit.title === title) {
        const updatedDates = habit.dates.map((dateObj) =>
          dateObj.date === clickedDate.replace(/"/g, "")
            ? { ...dateObj, isComplete: !dateObj.isComplete }
            : dateObj
        );

        return {
          ...habit,
          dates: updatedDates,
        };
      }

      return habit;
    });

    setHabits(updatedHabits);
    saveData({ habits: updatedHabits });
  }

  // Save all updated data at once
  async function saveData(
    updatedData: Partial<{ habits: { title: string }[] }>
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

  // Fetch all data once
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();
      setHabits(Array.isArray(data.habits) ? data.habits : []);
    }

    fetchData();
  }, []);

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
        dates: dates.map((date) => ({
          date: date.formattedDate,
          isComplete: false,
        })),
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
              <HabitCard
                key={index}
                habit={habit}
                completeHabit={completeHabit}
              />
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
