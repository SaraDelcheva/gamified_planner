"use client";
import { useState } from "react";
import styles from "./AddNewReward.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { IoDiamondOutline } from "react-icons/io5";
import AddOrCancelBtn from "../../goalsForToday/addGoal/addOrCancelBtn/AddOrCancelBtn";
import { AddNewRewardI } from "@/app/helpers/interfaces";

export default function AddNewReward({
  addNewReward,
  diamonds,
  newRewardName,
  handleInputChange,
  handleInputDiamondChange,
  coverName,
  setCoverName
}: AddNewRewardI) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const imageNames: string[] = ["reward.png", "book.png", "coffee.png"];
  const diamondOptions = [5, 10, 20, 30, 50, 100, 200, 500, 1000];
  const [tempCoverName, setTempCoverName] = useState<string>(coverName);

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
              value={String(newRewardName)}
              onChange={handleInputChange}
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
                backgroundImage: `url('/images/${coverName || "reward.png"}')`,
              }}
            ></div>
            <button
              className={`${styles.newBtn} boxShadow`}
            >
              <select
                className={styles.addNewRewardDropdown}
                value={diamonds ?? ""}
                onChange={(e) => handleInputDiamondChange(e)}
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
            <AddOrCancelBtn
              addNewGoal={() => {
                addNewReward();
                setExpanded(!expanded);
              }}
              onCancel={() => setExpanded(!expanded)}
            />
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className={styles.modalContainer}>
          <div className={styles.modalInner}>
            <div className="header">Choose Cover Image</div>
            <div className={styles.modalImagesContainer}>
              {imageNames.map((imageName, index) => (
                <div
                  onClick={() => {
                    setTempCoverName(imageName)
                  }}
                  key={index}
                  className={`${styles.modalImage} ${
                    tempCoverName === imageName ? styles.selected : ""
                  }`}
                  style={{ backgroundImage: `url(/images/${imageName})` }}
                ></div>
              ))}
            </div>
            <AddOrCancelBtn
           addNewGoal={() => {
            setCoverName(tempCoverName); 
            setIsModalOpen(false);
          }}
          onCancel={() => {
            setTempCoverName(coverName);
            setIsModalOpen(false);
          }}
            />
          </div>
        </div>
      )}
    </>
  );
}
