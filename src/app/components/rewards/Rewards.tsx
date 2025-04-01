"use client";
import { useState } from "react";
import styles from "./Rewards.module.css";
import RewardCard from "./rewardCard/RewardCard";
import AddNewReward from "./addNewReward/AddNewReward";

import { RewardsI } from "@/app/helpers/interfaces";

export default function Rewards(props: RewardsI) {
  const [isShopOpen, setIsShopOpen] = useState(false);

  return (
    <>
      <div
        className={styles.shop}
        onClick={() => {
          setIsShopOpen(!isShopOpen);
        }}
      ></div>

      <div className={`${styles.rewards} ${isShopOpen && styles.open}`}>
        <div className="header">Rewards Shop</div>
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
      </div>
    </>
  );
}
