"use client";
import styles from "./page.module.css";
import GoalsForToday from "./components/goalsForToday/GoalsForToday";
import PersonalInfo from "./components/personalInfo/PersonalInfo";
import { useGoalManager } from "./hooks/useGoalManager";

export default function Home() {
  const {
    todaysHistory,
    goals,
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
    setGoalName,
    setDifficulty,
    setCustomCoverName,
    setCustomRewardName,
    setIsCustom,
    setGoalDate,
    addNewGoal,
    cancelAddGoal,
    completeGoal,
    toggleExpanded,
    toggleCalendar,
    onClickDay,
  } = useGoalManager({ daysToShow: 1 });

  return (
    <div className={styles.page}>
      {dates.map(({ formattedDate, day }) => (
        <GoalsForToday
          key={formattedDate}
          {...{
            // From GoalsForTodayI
            title: day,
            goals: goals.filter((goal) => goal.date === formattedDate),
            completeGoal,
            totalDiamonds,
            customRewardName,
            setGoalDate,

            // From AddGoalI
            goalName,
            difficulty,
            isCustom,
            customCoverName,
            newGoalDate,
            goalDate: goalDate || formattedDate,

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
      ))}
      <PersonalInfo
        {...{
          todaysHistory,
          totalDiamonds,
        }}
      />
    </div>
  );
}
