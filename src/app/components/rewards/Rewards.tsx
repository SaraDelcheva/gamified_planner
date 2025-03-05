"use client";
import styles from "./Rewards.module.css";
import RewardCard from "./rewardCard/RewardCard";
import AddNewReward from "./addNewReward/AddNewReward";
import Treasure from "./treasure/Treasure";
import { RewardsI } from "@/app/helpers/interfaces";

export default function Rewards({
  totalDiamonds,
  rewards,
  rewardName,
  difficulty,
  isModalOpen,
  imageName,
  setCoverName,
  setIsModalOpen,
  setImageName,
  imageNames,
  InputChange,
  DiamondChange,
  addNewReward,
}: RewardsI) {
  return (
    <div className={styles.rewards}>
      <div className="header">
        <h1 className="headerH1">Rewards</h1>
      </div>
      <div className={styles.rewardsContainer}>
        {rewards.map((reward, index) => (
          <RewardCard
            key={index}
            rewardName={reward.title}
            diamonds={reward.diamonds ?? 0}
            cover={reward.cover}
            totalDiamonds={totalDiamonds}
          />
        ))}
        <AddNewReward
          diamonds={difficulty}
          newRewardName={rewardName}
          addNewReward={addNewReward}
          handleInputChange={InputChange}
          handleInputDiamondChange={DiamondChange}
          chooseRewardCover={() => setIsModalOpen(true)}
          imageName={imageName}
        />
      </div>
      <Treasure totalDiamonds={totalDiamonds} />
      {isModalOpen && (
        <div className={styles.modalContainer}>
          <div className={styles.modalInner}>
            {imageNames.map((imageName, index) => (
              <div
                onClick={() => {
                  setCoverName(imageName);
                  setImageName(imageName);
                  setIsModalOpen(false);
                }}
                key={index}
                className={styles.modalImage}
                style={{ backgroundImage: `url(/images/${imageName})` }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
