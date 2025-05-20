"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./Rewards.module.css";
import RewardCard from "./rewardCard/RewardCard";
import AddNewReward from "./addNewReward/AddNewReward";
import { RewardsI } from "@/app/helpers/interfaces";
import { useDiamonds } from "@/app/context/DiamondsContext";
import { FaShoppingBag } from "react-icons/fa";

export default function Rewards(props: Omit<RewardsI, "totalDiamonds">) {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const { totalBlueGems, totalRedGems, totalGreenGems, totalPinkGems } =
    useDiamonds();
  const rewardsRef = useRef<HTMLDivElement>(null);
  const shopBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        rewardsRef.current &&
        !rewardsRef.current.contains(event.target as Node) &&
        shopBtnRef.current &&
        !shopBtnRef.current.contains(event.target as Node) &&
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
        ref={shopBtnRef}
        className={styles.shopBtn}
        onClick={() => {
          setIsShopOpen(!isShopOpen);
        }}
      >
        <FaShoppingBag className={styles.shopIcon} />
      </div>

      <div
        ref={rewardsRef}
        className={`${styles.rewards} ${isShopOpen ? styles.open : ""}`}
      >
        <div className={styles.header}>Rewards Shop</div>

        <div className={styles.rewardsContainer}>
          <AddNewReward
            rewardPrice={props.rewardPrice}
            rewardCurrency={props.rewardCurrency}
            handleInputCurrencyChange={props.currencyChange}
            newRewardName={props.rewardName}
            addNewReward={props.addNewReward}
            handleInputChange={props.InputChange}
            handleInputPriceChange={props.PriceChange}
            setCoverName={props.setCoverName}
            coverName={props.coverName}
            isModalOpen={props.isModalOpen}
            setIsModalOpen={props.setIsModalOpen}
          />

          {props.rewards.map((reward) => (
            <RewardCard
              key={reward.id}
              rewardName={reward.title}
              price={reward.price ?? 0}
              currency={reward.currency}
              cover={reward.cover}
              totalBlueGems={totalBlueGems}
              totalGreenGems={totalGreenGems}
              totalPinkGems={totalPinkGems}
              totalRedGems={totalRedGems}
              claimReward={props.claimReward}
              id={reward.id}
              handleIsWishListed={props.handleIsWishListed}
              isWishListed={reward.isWishListed}
              claimedDate={reward.claimedDate}
              currentDate={props.currentDate}
            />
          ))}
        </div>
      </div>
    </>
  );
}
