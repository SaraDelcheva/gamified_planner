"use client";
import styles from "./Todo.module.css";
import GoalsForToday from "../components/goalsForToday/GoalsForToday";
import { useGoalManager } from "../hooks/useGoalManager";

export default function Todo() {
  const {
    goals,
    goalName,
    difficulty,
    newGoalDate,
    customCoverName,
    customRewardName,
    isCustom,
    expanded,
    isCalendarOpen,
    dates,
    totalDiamonds,
    setGoalName,
    setDifficulty,
    setCustomCoverName,
    setCustomRewardName,
    setIsCustom,
    addNewGoal,
    cancelAddGoal,
    completeGoal,
    toggleExpanded,
    toggleCalendar,
    onClickDay,
  } = useGoalManager({ daysToShow: 7 });

  return (
    <div className={styles.todo}>
      {dates.map(({ formattedDate, day }) => (
        <div className={styles.dailyGoals} key={formattedDate}>
          <GoalsForToday
            {...{
              // From GoalsForTodayI
              title: day,
              goals: goals.filter((goal) => goal.date === formattedDate),
              completeGoal,
              totalDiamonds,
              customRewardName,
              setGoalDate: () => {}, // Empty function since we don't need it anymore

              // From AddGoalI
              goalName,
              difficulty,
              isCustom,
              customCoverName,
              newGoalDate,
              goalDate: formattedDate,

              addNewGoal: () => addNewGoal(formattedDate),
              cancelAddGoal: () => cancelAddGoal(formattedDate),

              setGoalName,
              setDifficulty,
              setIsCustom,
              setCustomCoverName,
              setCustomRewardName,
              setExpanded: () => toggleExpanded(formattedDate),
              setIsCalendarOpen: () => toggleCalendar(formattedDate),

              expanded: expanded[formattedDate] || false,
              isCalendarOpen: isCalendarOpen[formattedDate] || false,
              onClickDay,
            }}
          />
        </div>
      ))}
    </div>
  );
}
