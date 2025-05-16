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

  // Handle subtask input changes
  const handleSubtaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSubtask(e.target.value);
  };

  // Add new subtask and reset input
  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      props.addCurrentSubtask(newSubtask);
      setNewSubtask(""); // Clear input after adding
    }
  };

  // Handle Enter key press in subtask input
  const handleSubtaskKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleAddSubtask();
    }
  };

  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  // Use currentSubtasks directly instead of fetching from goals
  const subtasks = props.currentSubtasks || [];

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
          {/* Subtasks Section - This is the key part we're fixing */}
          <div className={styles.subtasksSection}>
            <div className={styles.subtasksHeader}>
              <h4>Subtasks</h4>
              <div className={styles.subtaskInput}>
                <input
                  type="text"
                  placeholder="Subtask name"
                  value={newSubtask}
                  onChange={handleSubtaskInputChange}
                  onKeyDown={handleSubtaskKeyDown}
                />
                <button onClick={handleAddSubtask}>Add</button>
              </div>
            </div>

            <div className={styles.subtasksList}>
              {subtasks.length > 0 ? (
                subtasks.map((subtask: SubtaskI) => (
                  <div key={subtask.id} className={styles.subtaskItem}>
                    <div className={styles.subtaskLeft}>
                      <input
                        type="checkbox"
                        checked={subtask.isCompleted}
                        onChange={() =>
                          props.toggleCurrentSubtaskCompletion(subtask.id)
                        }
                      />
                      <span
                        className={subtask.isCompleted ? styles.completed : ""}
                      >
                        {subtask.title}
                      </span>
                    </div>
                    <button
                      className={styles.deleteSubtaskBtn}
                      onClick={() => props.deleteCurrentSubtask(subtask.id)}
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
