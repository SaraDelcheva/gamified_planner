"use client";
import { useState } from "react";
import styles from "./HabitCard.module.css";
import { FaCheck } from "react-icons/fa";
import { HabitI } from "@/app/helpers/interfaces";

interface HabitCardProps {
  habit: HabitI;
  completeHabit: (
    index: number | null,
    title: string,
    e: React.MouseEvent<HTMLDivElement>
  ) => void;
}

export default function HabitCard({ habit, completeHabit }: HabitCardProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  if (!habit) {
    return <div className={styles.habitCard}>No habit data available</div>;
  }
  return (
    <div className={styles.habitCard}>
      <div className={styles.habitName}>{habit.title}</div>
      <div className={styles.dates}>
        {habit.dates.map(({ date, isComplete }, index) => (
          <div
            key={index}
            className={`${styles.date} ${index === 0 ? styles.today : ""}  ${
              isComplete ? styles.clicked : ""
            }`}
            id={JSON.stringify(date)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={(e) => completeHabit(index, habit.title, e)}
          >
            {hoveredIndex === index && <FaCheck />}
          </div>
        ))}
      </div>
    </div>
  );
}
