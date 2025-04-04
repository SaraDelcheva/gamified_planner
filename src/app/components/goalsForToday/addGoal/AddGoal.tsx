import { AiOutlinePlus } from "react-icons/ai";
import { IoDiamondOutline } from "react-icons/io5";
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

  function easy(diamonds: number) {
    props.setDifficulty(diamonds);
  }

  return (
    <div
      className={`${styles.addGoal} ${props.expanded ? styles.expanded : ""}`}
    >
      <div className={styles.addGoalHeader}>
        {!props.expanded ? (
          <p className={styles.addGoalP}>Add A Goal</p>
        ) : (
          <input
            className={styles.addGoalInput}
            placeholder="Goal Name"
            type="text"
            value={props.goalName ?? ""}
            onChange={(e) => props.setGoalName(e.target.value)}
          />
        )}

        {!props.expanded && (
          <button
            className={`${styles.addBtn} boxShadow`}
            onClick={() => {
              props.setExpanded(!props.expanded);
            }}
          >
            <AiOutlinePlus />
          </button>
        )}
        {props.expanded && props.isCustom && (
          <button
            className={`${styles.customBtn} boxShadow`}
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
        )}
        {props.expanded && !props.isCustom && props.difficulty !== 0 && (
          <button className={`${styles.newBtn} boxShadow`}>
            {props.difficulty} <IoDiamondOutline />
          </button>
        )}
      </div>
      <div className={styles.expandedContent}>
        <div
          className={styles.date}
          onClick={() => props.setIsCalendarOpen(true)}
        >
          {props.newGoalDate ? props.newGoalDate : props.goalDate}
        </div>

        <div className={styles.buttons}>
          <button
            className={`${styles.addCustomRewardBtn} ${
              !props.isCustom ? styles.selected : ""
            }`}
            onClick={() => {
              props.setIsCustom(false);
            }}
          >
            <BiPlus className={styles.plusIcon} /> Choose Difficulty
          </button>

          <button
            className={`${styles.addCustomRewardBtn} ${
              props.isCustom ? styles.selected : ""
            }`}
            onClick={() => {
              props.setIsCustom(true);
            }}
          >
            <BiPlus className={styles.plusIcon} /> Add Custom Reward
          </button>
        </div>
        {!props.isCustom ? (
          <div className={styles.difficultyContainer}>
            <GoalDifficulty easy={easy} difficultyLevel="Easy" diamonds={5} />
            <GoalDifficulty
              easy={easy}
              difficultyLevel="Boring"
              diamonds={10}
            />
            <GoalDifficulty
              easy={easy}
              difficultyLevel="Difficult"
              diamonds={20}
            />
            <GoalDifficulty
              easy={easy}
              difficultyLevel="Impossible"
              diamonds={30}
            />
          </div>
        ) : (
          <div className={styles.addCustomReward}>
            <div className={styles.expandedContent}>
              <input
                type="text"
                onChange={(e) => props.setCustomRewardName(e.target.value)}
                className={styles.customRewardTitle}
                placeholder="Reward title"
              />
            </div>
          </div>
        )}
        {props.isCalendarOpen && (
          <div className={styles.calendarContainer}>
            <Calendar onClickDay={props.onClickDay} />
          </div>
        )}
        <div className={styles.addCancelContainer}>
          <AddOrCancelBtn
            onAdd={() => props.addNewGoal(props.goalDate)}
            onCancel={() => {
              props.setExpanded(!props.expanded);
              props.cancelAddGoal();
            }}
          />
        </div>
      </div>

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
