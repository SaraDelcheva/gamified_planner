import styles from "./AddNewHabit.module.css";
import AddOrCancelBtn from "../goalsForToday/addGoal/addOrCancelBtn/AddOrCancelBtn";

export default function AddNewHabit({
  addNewHabit,
  habitName,
  setHabitName,
  cancelAddHabit,
  isExpanded,
  setIsExpanded,
}: {
  addNewHabit: () => void;
  habitName: string;
  setHabitName: React.Dispatch<React.SetStateAction<string>>;
  cancelAddHabit: () => void;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div>
      <div className={styles.addNewHabit}>
        {isExpanded ? (
          <>
            <input
              type="text"
              value={habitName ? habitName : ""}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="Add New Habit"
            />
            <AddOrCancelBtn onCancel={cancelAddHabit} onAdd={addNewHabit} />
          </>
        ) : (
          <p onClick={() => setIsExpanded(true)}>+Add New Habit</p>
        )}
      </div>
    </div>
  );
}
