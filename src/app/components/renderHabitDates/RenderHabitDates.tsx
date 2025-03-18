"use client";
import { useState } from "react";
import { HabitI } from "@/app/helpers/interfaces";
import styles from "./RenderHabitDates.module.css";
import { FaCheck } from "react-icons/fa";

interface RenderHabitDatesI {
  habit: HabitI;
  completeHabit: (
    index: number | null,
    title: string,
    e: React.MouseEvent<HTMLDivElement>
  ) => void;
  dates: { formattedDate: string; day: string }[];
}

export default function RenderHabitDates({
  habit,
  completeHabit,
  dates,
}: RenderHabitDatesI) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return dates.map(({ formattedDate }, index) => {
    const habitDate = habit.dates.find((d) => d.date === formattedDate);
    const isComplete = habitDate ? habitDate.isComplete : false;

    return (
      <div
        key={index}
        className={`${styles.date} ${index === 0 ? styles.today : ""} ${
          isComplete ? styles.clicked : ""
        }`}
        id={JSON.stringify(formattedDate)}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={(e) => completeHabit(index, habit.title, e)}
      >
        {hoveredIndex === index && <FaCheck />}
      </div>
    );
  });
}
