"use client";
import styles from "./page.module.css";
import GoalsForToday from "./components/goalsForToday/GoalsForToday";
import PersonalInfo from "./components/personalInfo/PersonalInfo";
import TodaysHistory from "./components/todaysHistory/TodaysHistory";
import { useGoalManager } from "./hooks/useGoalManager";

export default function Home() {
  const {
    goals,
    notes,
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
    repeating,
    setGoalName,
    setDifficulty,
    setCustomCoverName,
    setCustomRewardName,
    setIsCustom,
    setGoalDate,
    setRepeating,
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
    removeReminder,
    goalNumber,
    completedGoalNumber,
    notCompletedGoalNumber,
    priority,
    addSubtask,
    toggleSubtaskCompletion,
    deleteSubtask,
    currentSubtasks,
    addCurrentSubtask,
    toggleCurrentSubtaskCompletion,
    deleteCurrentSubtask,
    handleInputChange,
  } = useGoalManager({ daysToShow: 1 });

  return (
    <div className={styles.page}>
      <div className={styles.mobileHistory}>
        <TodaysHistory />
      </div>
      <div className={styles.dailyGoals}>
        {dates.map(({ formattedDate, day }) => (
          <GoalsForToday
            key={formattedDate}
            {...{
              // From GoalsForTodayI
              title:
                formattedDate === dates[0].formattedDate
                  ? "Goals of Today"
                  : day,
              goals: goals.filter((goal) => goal.date === formattedDate),
              deleteGoal,
              editGoal,
              completeGoal,
              totalDiamonds,
              customRewardName,
              setGoalDate,
              notes,
              isEditing,
              editingGoalId,
              currency: rewardCurrency,
              repeating,
              setRepeating,
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
              removeReminder,

              expanded: expanded[formattedDate] || false,
              isCalendarOpen: isCalendarOpen[formattedDate] || false,
              onClickDay,
              rewardCurrency,
              priority,
              handleInputChange,
              addSubtask,
              toggleSubtaskCompletion,
              deleteSubtask,
              currentSubtasks,
              addCurrentSubtask,
              toggleCurrentSubtaskCompletion,
              deleteCurrentSubtask,
            }}
          />
        ))}
      </div>

      <div className={styles.infoAndHistory}>
        <PersonalInfo
          goalNumber={goalNumber}
          completedGoalNumber={completedGoalNumber}
          notCompletedGoalNumber={notCompletedGoalNumber}
          goals={goals}
        />
        <div className={styles.desktopHistory}>
          <TodaysHistory />
        </div>
      </div>
    </div>
  );
}
