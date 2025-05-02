"use client";
import styles from "./Todo.module.css";
import GoalsForToday from "../components/goalsForToday/GoalsForToday";
import { useGoalManager } from "../hooks/useGoalManager";

export default function Todo() {
  const {
    goals,
    notes,
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
    deleteGoal,
    editGoal,
    toggleExpanded,
    toggleCalendar,
    onClickDay,
    isEditing,
    editingGoalId,
    rewardCurrency,
    handleInputCurrencyChange,
    removeReminder,
  } = useGoalManager({ daysToShow: 7 });

  return (
    <div className={styles.todo}>
      {dates.map(({ formattedDate, day }) => (
        <div className={styles.dailyGoals} key={formattedDate}>
          <GoalsForToday
            {...{
              // From GoalsForTodayI
              title: formattedDate === dates[0].formattedDate ? "Today" : day,
              goals: goals.filter((goal) => goal.date === formattedDate),
              deleteGoal,
              editGoal,
              completeGoal,
              totalDiamonds,
              customRewardName,
              notes,
              isEditing,
              editingGoalId,
              currency: rewardCurrency,

              // From AddGoalI
              goalName,
              difficulty,
              isCustom,
              customCoverName,
              newGoalDate,
              goalDate: formattedDate,

              addNewGoal: () => addNewGoal(formattedDate),
              cancelAddGoal: () => cancelAddGoal(formattedDate),
              setGoalDate: () => {},

              setGoalName,
              setDifficulty,
              setIsCustom,
              setCustomCoverName,
              setCustomRewardName,
              setExpanded: () => toggleExpanded(formattedDate),
              setIsCalendarOpen: () => toggleCalendar(formattedDate),
              removeReminder,

              expanded: expanded[formattedDate] || false,
              isCalendarOpen: isCalendarOpen[formattedDate] || false,
              onClickDay,
              rewardCurrency,
              handleInputCurrencyChange,
            }}
          />
        </div>
      ))}
    </div>
  );
}
