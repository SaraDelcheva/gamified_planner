"use client";
import { useState } from "react";
import styles from "./AddCustomReward.module.css";
import { BiPlus } from "react-icons/bi";
import CoverModal from "@/app/components/coverModal/CoverModal";

export default function AddCustomReward({
  handleAddCustomReward,
  customCoverName,
  setCustomCoverName,
  setCustomRewardName,
}: {
  handleAddCustomReward: () => void;
  customCoverName: string;
  setCustomCoverName: React.Dispatch<React.SetStateAction<string>>;
  setCustomRewardName: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={styles.addCustomReward}>
        <button
          onClick={() => setIsExpanded(true)}
          className={styles.addCustomRewardBtn}
        >
          <BiPlus className={styles.plusIcon} /> Add Custom Reward
        </button>
        {isExpanded && (
          <div className={styles.expandedContent}>
            <input
              type="text"
              onChange={(e) => setCustomRewardName(e.target.value)}
              placeholder="Rewards name"
            />
          </div>
        )}
      </div>
      <div
        className={styles.customCoverImg}
        style={
          customCoverName
            ? { backgroundImage: `url("./images/${customCoverName}")` }
            : { backgroundImage: `url("./images/reward.png")` }
        }
      >
        <button onClick={() => setIsModalOpen(true)}>Choose Cover</button>
        <button onClick={handleAddCustomReward}>done</button>
      </div>
      {isModalOpen && (
        <CoverModal
          coverName={customCoverName}
          setCoverName={setCustomCoverName}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </>
  );
}
