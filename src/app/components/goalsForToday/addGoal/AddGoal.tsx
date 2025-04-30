import { AiOutlinePlus } from "react-icons/ai";
import styles from "./AddGoal.module.css";
import GoalDifficulty from "./goalDifficulty/GoalDifficulty";
import AddOrCancelBtn from "./addOrCancelBtn/AddOrCancelBtn";
import { AddGoalI } from "@/app/helpers/interfaces";
import { BiPlus } from "react-icons/bi";
import Calendar from "react-calendar";
import { useState } from "react";
import CoverModal from "@/app/components/coverModal/CoverModal";

export default function AddGoal(props: AddGoalI) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currencyOptions = ["blue-gem", "pink-gem", "green-gem", "red-gem"];

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

  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

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
              {props.isEditing ? "Edit addGoal" : "Add New addGoal"}
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
            <div
              className={styles.dateSelector}
              onClick={() => props.setIsCalendarOpen(!props.isCalendarOpen)}
            >
              {props.newGoalDate || props.goalDate}
            </div>
            <select
              className={styles.currencySelector}
              value={props.currency}
              onChange={props.handleInputCurrencyChange}
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
