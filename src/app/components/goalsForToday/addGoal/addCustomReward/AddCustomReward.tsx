"use client";
import { useState } from "react";
import styles from "./AddCustomReward.module.css";
import CoverModal from "@/app/components/coverModal/CoverModal";

export default function AddCustomReward({
  customCoverName,
  setCustomCoverName,
  setCustomRewardName,
}: {
  customCoverName: string;
  setCustomCoverName: React.Dispatch<React.SetStateAction<string>>;
  setCustomRewardName: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={styles.addCustomReward}>
        <div className={styles.expandedContent}>
          <input
            type="text"
            onChange={(e) => setCustomRewardName(e.target.value)}
            className={styles.customRewardTitle}
            placeholder="Reward title"
          />
        </div>
      </div>
      <div
        className={styles.customCoverImg}
        style={
          customCoverName
            ? { backgroundImage: `url("./images/${customCoverName}")` }
            : { backgroundImage: `url("./images/reward.png")` }
        }
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className={styles.customChooseCover}
        >
          Choose Cover
        </button>
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
