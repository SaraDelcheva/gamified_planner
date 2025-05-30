import { AiOutlinePlus } from "react-icons/ai";
import { BiPlus, BiTrash, BiMinus, BiChevronDown } from "react-icons/bi";
import { BsExclamationCircleFill, BsStars, BsListTask } from "react-icons/bs";
import { FiRepeat } from "react-icons/fi";
import { useState } from "react";
import styles from "./AddGoal.module.css";
import AddOrCancelBtn from "./addOrCancelBtn/AddOrCancelBtn";
import CustomSelect from "@/app/components/customSelect/CustomSelect";
import { AddGoalI, SubtaskI } from "@/app/helpers/interfaces";
import Calendar from "react-calendar";
import CoverModal from "@/app/components/coverModal/CoverModal";
import SubtaskProgress from "../subtaskProgress/SubtaskProgress";

export default function AddGoal(props: AddGoalI) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [isSubtaskExpanded, setIsSubtaskExpanded] = useState(false);

  // Currency options with icons
  const repeatOptions = [
    {
      value: "never",
      label: "Never",
      icon: <FiRepeat className={styles.gemIcon} />,
    },
    {
      value: "daily",
      label: "Daily",
      icon: <FiRepeat className={styles.gemIcon} />,
    },
    {
      value: "weekly",
      label: "Weekly",
      icon: <FiRepeat className={styles.gemIcon} />,
    },
    {
      value: "monthly",
      label: "Monthly",
      icon: <FiRepeat className={styles.gemIcon} />,
    },
  ];

  const currencyOptions = [
    {
      value: "sapphire",
      label: "",
      icon: (
        <div
          className={styles.gemIcon}
          style={{ backgroundImage: `url('/images/sapphire.svg')` }}
        />
      ),
    },
    {
      value: "crystal",
      label: "",
      icon: (
        <div
          className={styles.gemIcon}
          style={{ backgroundImage: `url('/images/crystal.svg')` }}
        />
      ),
    },
    {
      value: "emerald",
      label: "",
      icon: (
        <div
          className={styles.gemIcon}
          style={{ backgroundImage: `url('/images/emerald.svg')` }}
        />
      ),
    },
    {
      value: "ruby",
      label: "",
      icon: (
        <div
          className={styles.gemIcon}
          style={{ backgroundImage: `url('/images/ruby.svg')` }}
        />
      ),
    },
  ];

  // Priority options with icons
  const priorityOptions = [
    {
      value: "Today's focus",
      label: "Today's focus",
      icon: <BsStars color="#FFD700" />,
    },
    {
      value: "High Priority",
      label: "High Priority",
      icon: <BsExclamationCircleFill color="#FF4500" />,
    },
    {
      value: "Medium Priority",
      label: "Medium Priority",
      icon: <BsExclamationCircleFill color="#FFA500" />,
    },
    {
      value: "Low Priority",
      label: "Low Priority",
      icon: <BsExclamationCircleFill color="#90EE90" />,
    },
    {
      value: "Optional/Backlog",
      label: "Optional/Backlog",
      icon: <BsListTask color="#a0a0a0" />,
    },
  ];

  // Difficulty options with gem count display
  const difficultyOptions = [
    {
      value: "5",
      label: "",
      iconPosition: "right" as const,
      icon: (
        <div className={styles.difficultyOption}>
          <span>5</span>
          <div
            className={styles.gemIcon}
            style={{ backgroundImage: `url('/images/${props.currency}.svg')` }}
          />
        </div>
      ),
    },
    {
      value: "10",
      label: "",
      iconPosition: "right" as const,
      icon: (
        <div className={styles.difficultyOption}>
          <span>10</span>
          <div
            className={styles.gemIcon}
            style={{ backgroundImage: `url('/images/${props.currency}.svg')` }}
          />
        </div>
      ),
    },
    {
      value: "20",
      label: "",
      iconPosition: "right" as const,
      icon: (
        <div className={styles.difficultyOption}>
          <span>20</span>
          <div
            className={styles.gemIcon}
            style={{ backgroundImage: `url('/images/${props.currency}.svg')` }}
          />
        </div>
      ),
    },
    {
      value: "30",
      label: "",
      iconPosition: "right" as const,
      icon: (
        <div className={styles.difficultyOption}>
          <span>30</span>
          <div
            className={styles.gemIcon}
            style={{ backgroundImage: `url('/images/${props.currency}.svg')` }}
          />
        </div>
      ),
    },
  ];

  function tileDisabled({ date, view }: { date: Date; view: string }) {
    if (view === "month") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    }
    return false;
  }

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
            <p className={styles.addGoalTitle}>Add New Goal</p>
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
            ) : (
              <CustomSelect
                options={difficultyOptions}
                value={String(props.difficulty)}
                onChange={(value) =>
                  props.handleInputChange("difficulty", value)
                }
                placeholder=""
                className={styles.difficultySelect}
              />
            )}
          </div>
        )}
      </div>

      {props.expanded && (
        <div className={styles.addGoalContent}>
          <div className={styles.dateAndCurrency}>
            <div className={styles.customSelect}>
              <div
                className={styles.dateSelector}
                onClick={() => props.setIsCalendarOpen(!props.isCalendarOpen)}
              >
                <div className={styles.dateOption}>
                  {(() => {
                    const today = new Date();
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);

                    const selectedDate = props.newGoalDate || props.goalDate;
                    const selectedDateObj = new Date(selectedDate);

                    if (
                      today.toDateString() === selectedDateObj.toDateString()
                    ) {
                      return "Today";
                    } else if (
                      tomorrow.toDateString() === selectedDateObj.toDateString()
                    ) {
                      return "Tomorrow";
                    } else {
                      return selectedDate;
                    }
                  })()}
                </div>
                <div
                  className={`${styles.chevron} ${
                    props.isCalendarOpen ? styles.rotated : ""
                  }`}
                >
                  <BiChevronDown />
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
              </div>
            </div>
            <CustomSelect
              options={repeatOptions}
              value={props.repeating}
              onChange={(value) => props.handleInputChange("repeat", value)}
              placeholder="Repeating"
              className={styles.repeatSelector}
            />
            <CustomSelect
              options={priorityOptions}
              value={props.priority}
              onChange={(value) => props.handleInputChange("priority", value)}
              placeholder="Priority"
              className={styles.prioritySelector}
            />
            <div>
              {!props.isCustom && (
                <CustomSelect
                  options={currencyOptions}
                  value={props.currency}
                  onChange={(value) =>
                    props.handleInputChange("currency", value)
                  }
                  placeholder=""
                  className={styles.currencySelector}
                />
              )}
            </div>

            <div className={styles.customSelect}>
              <div
                className={`${styles.customRewardSelector} ${
                  props.isCustom ? styles.active : ""
                }`}
                onClick={() => props.setIsCustom(!props.isCustom)}
              >
                {props.isCustom ? (
                  <>
                    <BiMinus className={styles.plusIcon} />
                    Custom Reward
                  </>
                ) : (
                  <>
                    <BiPlus className={styles.plusIcon} />
                    Custom Reward
                  </>
                )}
              </div>
            </div>
          </div>

          {props.isCustom && (
            <div className={styles.customRewardSection}>
              <input
                type="text"
                className={styles.customRewardInput}
                placeholder="Custom reward title"
                onChange={(e) => props.setCustomRewardName(e.target.value)}
              />
            </div>
          )}

          <div className={styles.subtasksSection}>
            <div
              className={styles.subtaskToggle}
              onClick={() => setIsSubtaskExpanded(!isSubtaskExpanded)}
            >
              <span className={styles.subtaskToggleContent}>
                {/* Circular Progress Diagram */}
                {subtasks.length > 0 && <SubtaskProgress subtasks={subtasks} />}
                Subtasks{" "}
                {subtasks.length > 0 && (
                  <>
                    ({subtasks.filter((subtask) => subtask.isCompleted).length}/
                    {subtasks.length})
                  </>
                )}
              </span>
              <div
                className={`${styles.chevron} ${
                  isSubtaskExpanded ? styles.rotated : ""
                }`}
              >
                <BiChevronDown />
              </div>
            </div>

            {isSubtaskExpanded && (
              <>
                <div className={styles.subtasksHeader}>
                  <div className={styles.subtaskInput}>
                    <input
                      type="text"
                      placeholder="Add subtask..."
                      value={newSubtask}
                      onChange={handleSubtaskInputChange}
                      onKeyDown={handleSubtaskKeyDown}
                    />
                    <button
                      onClick={handleAddSubtask}
                      className={styles.subtaskAddBtn}
                    >
                      <BiPlus />
                    </button>
                  </div>
                </div>

                <div className={styles.subtasksList}>
                  {subtasks.map((subtask: SubtaskI) => (
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
                          className={
                            subtask.isCompleted ? styles.completed : ""
                          }
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
                  ))}
                </div>
              </>
            )}
          </div>

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
