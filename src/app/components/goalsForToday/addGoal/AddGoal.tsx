import { AiOutlinePlus } from "react-icons/ai";
import { BiPlus, BiTrash } from "react-icons/bi";
import { FiRepeat } from "react-icons/fi";
import { useState } from "react";
import styles from "./AddGoal.module.css";
import GoalDifficulty from "./goalDifficulty/GoalDifficulty";
import AddOrCancelBtn from "./addOrCancelBtn/AddOrCancelBtn";
import CustomSelect from "@/app/components/customSelect/CustomSelect";
import { AddGoalI, SubtaskI } from "@/app/helpers/interfaces";
import Calendar from "react-calendar";
import CoverModal from "@/app/components/coverModal/CoverModal";

export default function AddGoal(props: AddGoalI) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRepeatingModalOpen, setIsRepeatingModalOpen] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);

  const currencyOptions = ["sapphire", "crystal", "emerald", "ruby"];
  const priorityOptions = [
    "none",
    "Today's focus",
    "High Priority",
    "Medium Priority",
    "Low Priority",
    "Optional/Backlog",
  ];

  function easy(diamonds: number) {
    props.setDifficulty(diamonds);
  }

  function tileDisabled({ date, view }: { date: Date; view: string }) {
    if (view === "month") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    }
    return false;
  }

  // Handler for currency change with CustomSelect
  const handleCurrencyChange = (option: string) => {
    props.handleInputCurrencyChange({
      target: { value: option },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  // Handler for priority change with CustomSelect
  const handlePriorityChange = (option: string) => {
    props.handleInputPriorityChange({
      target: { value: option },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  // Get subtasks of the currently editing goal
  const getSubtasks = () => {
    if (props.isEditing && props.editingGoalId) {
      const editingGoal = props.goals?.find(
        (goal) => goal.title === props.editingGoalId
      );
      return editingGoal?.subtasks || [];
    }
    return [];
  };

  // Add a new subtask
  const handleAddSubtask = () => {
    if (newSubtask.trim() && props.addSubtask && props.editingGoalId) {
      props.addSubtask(props.editingGoalId, newSubtask);
      setNewSubtask("");
    }
  };

  // Toggle subtask completion
  const handleToggleSubtask = (subtaskId: string) => {
    if (props.toggleSubtaskCompletion && props.editingGoalId) {
      props.toggleSubtaskCompletion(props.editingGoalId, subtaskId);
    }
  };

  // Delete a subtask
  const handleDeleteSubtask = (subtaskId: string) => {
    if (props.deleteSubtask && props.editingGoalId) {
      props.deleteSubtask(props.editingGoalId, subtaskId);
    }
  };

  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  const subtasks = getSubtasks();

  return (
    <div
      className={`${styles.addGoal} ${props.expanded ? styles.expanded : ""}`}
    >
      <div
        className={styles.addGoalHeader}
        onClick={() => !props.expanded && props.setExpanded(true)}
      >
        {!props.expanded ? (
          <div className={styles.collapsedHeader}>
            <p className={styles.addGoalTitle}>
              {props.isEditing ? "Edit Goal" : "Add New Goal"}
            </p>
            <button className={`${styles.addBtn} ${styles.boxShadow}`}>
              <AiOutlinePlus />
            </button>
          </div>
        ) : (
          <div className={styles.expandedHeader}>
            <input
              className={styles.addGoalInput}
              placeholder="Goal Name"
              type="text"
              value={props.goalName ?? ""}
              onChange={(e) => props.setGoalName(e.target.value)}
            />

            {props.isCustom ? (
              <button
                className={`${styles.customBtn} ${styles.boxShadow}`}
                style={
                  props.customCoverName
                    ? {
                        backgroundImage: `url("/images/rewards/${props.customCoverName}.svg")`,
                      }
                    : { backgroundImage: `url("/images/rewards/reward.svg")` }
                }
                onClick={() => setIsModalOpen(true)}
              >
                <div className={styles.coverOverlay}>
                  <AiOutlinePlus />
                </div>
              </button>
            ) : props.difficulty !== 0 ? (
              <div className={`${styles.rewardBadge} ${styles.boxShadow}`}>
                {props.difficulty}{" "}
                <div
                  className={styles.gemIcon}
                  style={{
                    backgroundImage: `url('/images/${props.currency}.svg')`,
                  }}
                ></div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {props.expanded && (
        <div className={styles.addGoalContent}>
          <div className={styles.dateAndCurrency}>
            <div>
              <div
                className={styles.dateSelector}
                onClick={() => props.setIsCalendarOpen(!props.isCalendarOpen)}
              >
                <div className={styles.dateOption}>
                  {props.newGoalDate || props.goalDate}
                </div>
              </div>
            </div>
            <div className={styles.repeatSelector}>
              <div
                onClick={() => setIsRepeatingModalOpen(!isRepeatingModalOpen)}
                className={styles.repeatingOption}
              >
                {" "}
                <FiRepeat /> {props.repeating}
              </div>
            </div>

            {/* Custom Priority Select component */}
            <CustomSelect
              options={priorityOptions}
              value={props.priority}
              onChange={handlePriorityChange}
              type="priority"
              className={styles.prioritySelector}
            />

            {/* Custom Currency Select component */}
            <CustomSelect
              options={currencyOptions}
              value={props.currency}
              onChange={handleCurrencyChange}
              type="currency"
              className={styles.currencySelector}
            />
          </div>
          {isRepeatingModalOpen && (
            <div
              onClick={() => setIsRepeatingModalOpen(!isRepeatingModalOpen)}
              className={styles.repeatingOptions}
            >
              <button
                className={styles.repeatingOption}
                onClick={() => props.setRepeating("never")}
              >
                <FiRepeat /> Is not repeating
              </button>
              <button
                className={styles.repeatingOption}
                onClick={() => props.setRepeating("daily")}
              >
                <FiRepeat /> Daily
              </button>
              <button
                className={styles.repeatingOption}
                onClick={() => props.setRepeating("weekly")}
              >
                <FiRepeat /> Every Week
              </button>
              <button
                className={styles.repeatingOption}
                onClick={() => props.setRepeating("monthly")}
              >
                <FiRepeat /> Every Month
              </button>
            </div>
          )}

          <div className={styles.rewardTypeToggle}>
            <button
              className={`${styles.toggleButton} ${
                !props.isCustom ? styles.active : ""
              }`}
              onClick={() => props.setIsCustom(false)}
            >
              <BiPlus className={styles.plusIcon} /> Choose Difficulty
            </button>
            <button
              className={`${styles.toggleButton} ${
                props.isCustom ? styles.active : ""
              }`}
              onClick={() => props.setIsCustom(true)}
            >
              <BiPlus className={styles.plusIcon} /> Add Custom Reward
            </button>
          </div>

          {!props.isCustom ? (
            <div className={styles.difficultyGrid}>
              <GoalDifficulty
                easy={easy}
                difficultyLevel="Easy"
                diamonds={5}
                currency={props.currency}
                selectedDifficulty={props.difficulty}
              />
              <GoalDifficulty
                easy={easy}
                difficultyLevel="Boring"
                diamonds={10}
                currency={props.currency}
                selectedDifficulty={props.difficulty}
              />
              <GoalDifficulty
                easy={easy}
                difficultyLevel="Difficult"
                diamonds={20}
                currency={props.currency}
                selectedDifficulty={props.difficulty}
              />
              <GoalDifficulty
                easy={easy}
                difficultyLevel="Impossible"
                diamonds={30}
                currency={props.currency}
                selectedDifficulty={props.difficulty}
              />
            </div>
          ) : (
            <div className={styles.customRewardSection}>
              <input
                type="text"
                className={styles.customRewardInput}
                placeholder="Reward title"
                onChange={(e) => props.setCustomRewardName(e.target.value)}
              />
            </div>
          )}
          <div className={styles.subtasksSection}>
            <div className={styles.subtasksHeader}>
              <h4>Subtasks</h4>
              <button
                className={styles.addSubtaskBtn}
                onClick={() => setShowSubtaskInput(!showSubtaskInput)}
              >
                <AiOutlinePlus /> {showSubtaskInput ? "Cancel" : "Add Subtask"}
              </button>
            </div>

            {showSubtaskInput && (
              <div className={styles.subtaskInput}>
                <input
                  type="text"
                  placeholder="Subtask name"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
                />
                <button onClick={handleAddSubtask}>Add</button>
              </div>
            )}

            <div className={styles.subtasksList}>
              {subtasks.length > 0 ? (
                subtasks.map((subtask: SubtaskI) => (
                  <div key={subtask.id} className={styles.subtaskItem}>
                    <div className={styles.subtaskLeft}>
                      <input
                        type="checkbox"
                        checked={subtask.isCompleted}
                        onChange={() => handleToggleSubtask(subtask.id)}
                      />
                      <span
                        className={subtask.isCompleted ? styles.completed : ""}
                      >
                        {subtask.title}
                      </span>
                    </div>
                    <button
                      className={styles.deleteSubtaskBtn}
                      onClick={() => handleDeleteSubtask(subtask.id)}
                    >
                      <BiTrash />
                    </button>
                  </div>
                ))
              ) : (
                <p className={styles.noSubtasks}>No subtasks yet</p>
              )}
            </div>
          </div>

          {props.isCalendarOpen && (
            <div className={styles.calendarWrapper}>
              <Calendar
                onClickDay={props.onClickDay}
                tileDisabled={tileDisabled}
                minDate={minDate}
                value={
                  props.newGoalDate
                    ? new Date(props.newGoalDate)
                    : new Date(props.goalDate)
                }
              />
            </div>
          )}

          <div className={styles.actionButtons}>
            <AddOrCancelBtn
              onAdd={() => props.addNewGoal(props.goalDate)}
              onCancel={() => {
                props.setExpanded(!props.expanded);
                props.cancelAddGoal();
              }}
            />
          </div>
        </div>
      )}

      {isModalOpen && (
        <CoverModal
          coverName={props.customCoverName}
          setCoverName={props.setCustomCoverName}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
}
