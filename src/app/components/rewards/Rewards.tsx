"use client";
import styles from "./Rewards.module.css";
import RewardCard from "./rewardCard/RewardCard";
import AddNewReward from "./addNewReward/AddNewReward";
import Treasure from "./treasure/Treasure";
import { RewardsI } from "@/app/helpers/interfaces";
import AddOrCancelBtn from "../goalsForToday/addGoal/addOrCancelBtn/AddOrCancelBtn";

export default function Rewards({
  totalDiamonds,
  rewards,
  rewardName,
  rewardPrice,
  InputChange,
  DiamondChange,
  addNewReward,
  claimReward,
  coverName,
  setCoverName
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
            claimReward={claimReward}
          />
        ))}
        <AddNewReward
          diamonds={rewardPrice}
          newRewardName={rewardName}
          addNewReward={addNewReward}
          handleInputChange={InputChange}
          handleInputDiamondChange={DiamondChange}
          setCoverName={setCoverName}
          coverName={coverName}
        />
      </div>
      <Treasure totalDiamonds={totalDiamonds} />
     
    </div>
  );
}
