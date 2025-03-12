"use client";
import { useState } from "react";
import styles from "./AddNewReward.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { IoDiamondOutline } from "react-icons/io5";
import { AddNewRewardI } from "@/app/helpers/interfaces";
import AddOrCancelBtn from "../../goalsForToday/addGoal/addOrCancelBtn/AddOrCancelBtn";
import CoverModal from "../../coverModal/CoverModal";

export default function AddNewReward(props: AddNewRewardI) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const diamondOptions = [5, 10, 20, 30, 50, 100, 200, 500, 1000];

  return (
    <>
      <div
        className={`${styles.addNewReward} ${!expanded && styles.expanded}`}
        onClick={() => {
          if (!expanded) setExpanded(true);
        }}
      >
        <p className={styles.addNewRewardP}>
          <AiOutlinePlus />{" "}
          {expanded ? (
            <input
              type="text"
              value={String(props.newRewardName)}
              onChange={props.handleInputChange}
              className={styles.addNewRewardInput}
              placeholder="Add a reward"
            />
          ) : (
            "Add a reward"
          )}
        </p>
        {expanded && (
          <div className={styles.expandedContent}>
            <div
              onClick={() => setIsModalOpen(true)}
              className={styles.rewardCardImg}
              style={{
                backgroundImage: `url('/images/${
                  props.coverName || "reward.png"
                }')`,
              }}
            >
              <div className={styles.addCancelContainer}>
                <AddOrCancelBtn
                  addNewGoal={() => {
                    props.addNewReward();
                    setExpanded(!expanded);
                  }}
                  onCancel={() => setExpanded(!expanded)}
                />
              </div>
            </div>
            <button className={`${styles.newBtn} boxShadow`}>
              <select
                className={styles.addNewRewardDropdown}
                value={props.diamonds ?? ""}
                onChange={(e) => props.handleInputDiamondChange(e)}
              >
                <option value="" disabled>
                  ?
                </option>
                {diamondOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <IoDiamondOutline />
            </button>
          </div>
        )}
      </div>
      {isModalOpen && (
        <CoverModal
          coverName={props.coverName}
          setCoverName={props.setCoverName}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </>
  );
}
