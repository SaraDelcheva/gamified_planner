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

          {props.notes?.length > 0 && (
            <div className={styles.reminderNotesContainer}>
              {(() => {
                const reminders = props.notes.filter(
                  (note) => note.reminder === props.goalDate
                );

                if (reminders.length === 0) {
                  return null;
                }

                return reminders.map((note, index) => (
                  <div
                    key={`reminder-${index}`}
                    className={styles.reminderNote}
                  >
                    <h4>{note.title || ""}</h4>
                    <p>{note.content || ""}</p>
                  </div>
                ));
              })()}
            </div>
          )}
          <AddGoal
            addNewGoal={props.addNewGoal}
            isEditing={props.isEditing}
            editingGoalId={props.editingGoalId}
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
                  deleteGoal={props.deleteGoal}
                  editGoal={props.editGoal}
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
