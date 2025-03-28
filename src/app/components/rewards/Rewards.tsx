"use client";
import styles from "./Rewards.module.css";
import RewardCard from "./rewardCard/RewardCard";
import AddNewReward from "./addNewReward/AddNewReward";
import Treasure from "./treasure/Treasure";
import { RewardsI } from "@/app/helpers/interfaces";

export default function Rewards(props: RewardsI) {
  return (
    <div className={styles.rewards}>
      <div className="header">
        <h1 className="headerH1">Rewards Shop</h1>
      </div>
      <div className={styles.rewardsContainer}>
        {props.rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            rewardName={reward.title}
            diamonds={reward.diamonds ?? 0}
            cover={reward.cover}
            totalDiamonds={props.totalDiamonds}
            claimReward={props.claimReward}
            id={reward.id}
            handleIsWishListed={props.handleIsWishListed}
            isWishListed={reward.isWishListed}
          />
        ))}
        <AddNewReward
          diamonds={props.rewardPrice}
          newRewardName={props.rewardName}
          addNewReward={props.addNewReward}
          handleInputChange={props.InputChange}
          handleInputDiamondChange={props.DiamondChange}
          setCoverName={props.setCoverName}
          coverName={props.coverName}
          isModalOpen={props.isModalOpen}
          setIsModalOpen={props.setIsModalOpen}
        />
      </div>
      <Treasure totalDiamonds={props.totalDiamonds} />
    </div>
  );
}
