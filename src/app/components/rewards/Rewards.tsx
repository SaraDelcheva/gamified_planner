"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./Rewards.module.css";
import RewardCard from "./rewardCard/RewardCard";
import AddNewReward from "./addNewReward/AddNewReward";
import { RewardsI } from "@/app/helpers/interfaces";
import { useDiamonds } from "@/app/context/DiamondsContext";

export default function Rewards(props: Omit<RewardsI, "totalDiamonds">) {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const { totalDiamonds } = useDiamonds();
  const rewardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        rewardsRef.current &&
        !rewardsRef.current.contains(event.target as Node) &&
        isShopOpen
      ) {
        setIsShopOpen(false);
      }
    }

    if (isShopOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShopOpen]);

  return (
    <>
      <div
        className={styles.shop}
        onClick={() => {
          setIsShopOpen(!isShopOpen);
        }}
      ></div>

      <div
        ref={rewardsRef}
        className={`${styles.rewards} ${isShopOpen && styles.open}`}
      >
        <div className={styles.header}>Rewards Shop</div>
        <div className={styles.rewardsContainer}>
          {props.rewards.map((reward) => (
            <RewardCard
              key={reward.id}
              rewardName={reward.title}
              diamonds={reward.diamonds ?? 0}
              cover={reward.cover}
              totalDiamonds={totalDiamonds}
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
