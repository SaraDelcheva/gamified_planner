"use client";
import { useState } from "react";
import styles from "./AddNewReward.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { IoDiamondOutline } from "react-icons/io5";
import AddOrCancelBtn from "../../goalsForToday/addGoal/addOrCancelBtn/AddOrCancelBtn";

export default function AddNewReward({
  addNewReward,
  diamonds,
  newRewardName,
  handleInputChange,
  handleInputDiamondChange,
  chooseRewardCover,
  imageName,
}: {
  addNewReward: () => void;
  diamonds: number | null;
  newRewardName: string | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputDiamondChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  chooseRewardCover: () => void;
  imageName: string;
}) {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
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
            onClick={chooseRewardCover}
            className={styles.rewardCardImg}
            style={{
              backgroundImage: `url('/images/${imageName || "reward.png"}')`,
            }}
          ></div>
          <button
            onClick={addNewReward}
            className={`${styles.newBtn} boxShadow`}
          >
            <input
              className={styles.addNewRewardInputNum}
              type="number"
              placeholder="?"
              value={diamonds ?? ""}
              onChange={handleInputDiamondChange}
            />
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
  );
}
