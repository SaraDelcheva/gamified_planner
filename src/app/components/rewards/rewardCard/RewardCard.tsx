"use client";
import { useState } from "react";
import styles from "./RewardCard.module.css";
import { IoDiamondOutline } from "react-icons/io5";
import { RewardCardI } from "@/app/helpers/interfaces";
import { AiFillHeart } from "react-icons/ai";

export default function RewardCard(props: RewardCardI) {
  const [isHovered, setIsHovered] = useState(false);
  // const [isWishListed, setIsWishListed] = useState(false);
  const isClaimable = props.diamonds <= props.totalDiamonds;

  return (
    <div className={`${styles.rewardCard} rewardCard`} id={props.id}>
      <div className={styles.rewardCardTitle}>
        <div
          className={styles.wishlistToggle}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            props.handleIsWishListed(e);
          }}
        >
          <AiFillHeart
            className={styles.wishlistIcon}
            style={{ color: props.isWishListed ? "red" : "white" }}
          />
        </div>
        <p className={`${styles.rewardCardP} rewardCardP`}>
          {props.rewardName}
        </p>
      </div>
      <div
        className={styles.rewardCardInner}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`${styles.rewardCardImg} rewardCardImg`}
          style={{
            backgroundImage: `url('/images/rewards/${
              props.cover ? props.cover : "reward"
            }.svg')`,
          }}
        ></div>
        <div className={styles.rewardCardInfo}>
          <div className="buttonContainer">
            {isHovered && isClaimable ? (
              <button
                className={`${styles.claimBtn} claimBtn boxShadow`}
                disabled={!isClaimable}
                onClick={props.claimReward}
              >
                Claim
              </button>
            ) : (
              <button
                className={`${styles.newBtn} newBtn boxShadow`}
                disabled={!isClaimable}
              >
                {props.diamonds} <IoDiamondOutline className="diamondIcon" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
