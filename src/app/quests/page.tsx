"use client";
import { useState } from "react";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";
import Calendar from "react-calendar";
import styles from "./Quests.module.css";

export default function Quest({
  isEditing = false,
  initialGoalName = "",
  initialGoalDate = new Date().toLocaleDateString(),
  initialDifficulty = 0,
  initialCurrency = "blue-gem",
  initialCustomRewardName = "",
  initialCustomCoverName = "",
  onSave = () => {},
  onCancel = () => {},
}) {
  // State management
  const [expanded, setExpanded] = useState(false);
  const [goalName, setGoalName] = useState(initialGoalName);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [isCustom, setIsCustom] = useState(false);
  const [customRewardName, setCustomRewardName] = useState(
    initialCustomRewardName
  );
  const [customCoverName, setCustomCoverName] = useState(
    initialCustomCoverName
  );
  const [currency, setCurrency] = useState(initialCurrency);
  const [goalDate, setGoalDate] = useState(initialGoalDate);
  const [newGoalDate, setNewGoalDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currencyOptions = ["blue-gem", "pink-gem", "green-gem", "red-gem"];
  const imageNames = [
    "book",
    "coffee",
    "food",
    "icecream",
    "meditate",
    "movie",
    "reward",
    "sleep",
    "videogames",
    "workout",
  ];

  // Handlers
  const handleInputCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleDifficultySelect = (diamonds) => {
    setDifficulty(diamonds);
  };

  const onClickDay = (date) => {
    setNewGoalDate(date.toLocaleDateString());
    setIsCalendarOpen(false);
  };

  const addNewGoal = () => {
    const addGoalData = {
      name: goalName,
      date: newGoalDate || goalDate,
      difficulty: isCustom ? 0 : difficulty,
      currency: currency,
      isCustom: isCustom,
      customRewardName: customRewardName,
      customCoverName: customCoverName,
    };

    onSave(addGoalData);
    resetForm();
  };

  const cancelAddGoal = () => {
    resetForm();
    onCancel();
  };

  const resetForm = () => {
    if (!isEditing) {
      setGoalName("");
      setDifficulty(0);
      setIsCustom(false);
      setCustomRewardName("");
      setCustomCoverName("");
      setNewGoalDate(null);
    }
    setExpanded(falsdive);
    setIsCalendarOpen(false);
  };

  // Helper functions for calendar
  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    }
    return false;
  };

  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  return (
    <div className={`${styles.addGoal} ${expanded ? styles.expanded : ""}`}>
      <div
        className={styles.addGoalHeader}
        onClick={() => !expanded && setExpanded(true)}
      >
        {!expanded ? (
          <div className={styles.collapsedHeader}>
            <p className={styles.addGoalTitle}>
              {isEditing ? "Edit addGoal" : "Add New addGoal"}
            </p>
            <button className={`${styles.addBtn} ${styles.boxShadow}`}>
              <AiOutlinePlus />
            </button>
          </div>
        ) : (
          <div className={styles.expandedHeader}>
            <input
              className={styles.addGoalInput}
              placeholder="addGoal Name"
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
            />

            {isCustom ? (
              <button
                className={`${styles.customBtn} ${styles.boxShadow}`}
                style={
                  customCoverName
                    ? {
                        backgroundImage: `url("/images/rewards/${customCoverName}.svg")`,
                      }
                    : { backgroundImage: `url("/images/rewards/reward.svg")` }
                }
                onClick={() => setIsModalOpen(true)}
              >
                <div className={styles.coverOverlay}>
                  <AiOutlinePlus />
                </div>
              </button>
            ) : difficulty !== 0 ? (
              <div className={`${styles.rewardBadge} ${styles.boxShadow}`}>
                {difficulty}{" "}
                <div
                  className={styles.gemIcon}
                  style={{
                    backgroundImage: `url('/images/${currency}.svg')`,
                  }}
                ></div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {expanded && (
        <div className={styles.addGoalContent}>
          <div className={styles.dateAndCurrency}>
            <div
              className={styles.dateSelector}
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              {newGoalDate || goalDate}
            </div>
            <select
              className={styles.currencySelector}
              value={currency}
              onChange={handleInputCurrencyChange}
            >
              {currencyOptions.map((option) => (
                <option key={option} value={option}>
                  {option.split("-")[0]}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.rewardTypeToggle}>
            <button
              className={`${styles.toggleButton} ${
                !isCustom ? styles.active : ""
              }`}
              onClick={() => setIsCustom(false)}
            >
              <BiPlus className={styles.plusIcon} /> Choose Difficulty
            </button>
            <button
              className={`${styles.toggleButton} ${
                isCustom ? styles.active : ""
              }`}
              onClick={() => setIsCustom(true)}
            >
              <BiPlus className={styles.plusIcon} /> Add Custom Reward
            </button>
          </div>

          {!isCustom ? (
            <div className={styles.difficultyGrid}>
              {[
                { level: "Easy", value: 5 },
                { level: "Boring", value: 10 },
                { level: "Difficult", value: 20 },
                { level: "Impossible", value: 30 },
              ].map((level) => (
                <div
                  key={level.level}
                  className={`${styles.difficultyOption} ${
                    difficulty === level.value ? styles.selectedDifficulty : ""
                  }`}
                  onClick={() => handleDifficultySelect(level.value)}
                >
                  <p>{level.level}</p>
                  <div
                    className={`${styles.difficultyBadge} ${styles.boxShadow}`}
                  >
                    <span>{level.value}</span>
                    <div
                      className={styles.gemIcon}
                      style={{
                        backgroundImage: `url('/images/${currency}.svg')`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.customRewardSection}>
              <input
                type="text"
                className={styles.customRewardInput}
                placeholder="Reward title"
                value={customRewardName}
                onChange={(e) => setCustomRewardName(e.target.value)}
              />
            </div>
          )}

          {isCalendarOpen && (
            <div className={styles.calendarWrapper}>
              <Calendar
                onClickDay={onClickDay}
                tileDisabled={tileDisabled}
                minDate={minDate}
                value={newGoalDate ? new Date(newGoalDate) : new Date(goalDate)}
              />
            </div>
          )}

          <div className={styles.actionButtons}>
            <button className={styles.cancelButton} onClick={cancelAddGoal}>
              <AiOutlineClose />
            </button>
            <button className={styles.saveButton} onClick={addNewGoal}>
              <FaPlay />
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Choose Cover Image</h3>
            <div className={styles.imageGrid}>
              {imageNames.map((imageName) => (
                <div
                  key={imageName}
                  className={`${styles.imageOption} ${
                    customCoverName === imageName ? styles.selectedImage : ""
                  }`}
                  style={{
                    backgroundImage: `url(/images/rewards/${imageName}.svg)`,
                  }}
                  onClick={() => setCustomCoverName(imageName)}
                ></div>
              ))}
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setIsModalOpen(false)}
              >
                <AiOutlineClose />
              </button>
              <button
                className={styles.saveButton}
                onClick={() => setIsModalOpen(false)}
              >
                <FaPlay />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
