import styles from "./GoalsForToday.module.css";
import AddGoal from "./addGoal/AddGoal";
import NewGoal from "./newGoal/NewGoal";
import { GoalsForTodayI } from "../../helpers/interfaces";

export default function GoalsForToday(props: GoalsForTodayI) {
  return (
    <div className={styles.goalsForToday} id={props.goalDate}>
      <div className={styles.goalsContainer}>
        <div className={styles.headerSection}>
          <div className={styles.header}>{props.title}</div>
          <AddGoal
            addNewGoal={props.addNewGoal}
            setDifficulty={props.setDifficulty}
            difficulty={props.difficulty}
            goalName={props.goalName}
            setGoalName={props.setGoalName}
            expanded={props.expanded}
            setExpanded={props.setExpanded}
            customCoverName={props.customCoverName}
            setCustomCoverName={props.setCustomCoverName}
            setCustomRewardName={props.setCustomRewardName}
            setIsCustom={props.setIsCustom}
            isCustom={props.isCustom}
            cancelAddGoal={props.cancelAddGoal}
            isCalendarOpen={props.isCalendarOpen}
            setIsCalendarOpen={props.setIsCalendarOpen}
            goalDate={props.goalDate}
            onClickDay={props.onClickDay}
            newGoalDate={props.newGoalDate}
          />
        </div>

        <div className={styles.scrollArea}>
          <div className={styles.dailyGoalsContainer}>
            {props.goals
              .filter((goal) => goal.date === props.goalDate)
              .map((goal, index) => (
                <NewGoal
                  key={index}
                  goalTitle={goal.title}
                  diamonds={goal.diamonds}
                  isCustom={goal.isCustom}
                  completeGoal={props.completeGoal}
                  customCoverName={goal.coverName}
                  customRewardName={goal.rewardName}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
