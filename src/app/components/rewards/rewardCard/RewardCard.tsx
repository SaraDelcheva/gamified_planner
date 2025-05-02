"use client";
import { useState } from "react";
import styles from "./RewardCard.module.css";
import { RewardCardI } from "@/app/helpers/interfaces";
import { AiFillHeart } from "react-icons/ai";

export default function RewardCard(props: RewardCardI) {
  const [isHovered, setIsHovered] = useState(false);
  const isClaimable =
    props.currency === "blue-gem"
      ? props.price <= props.totalBlueGems
      : props.currency === "pink-gem"
      ? props.price <= props.totalPinkGems
      : props.currency === "red-gem"
      ? props.price <= props.totalRedGems
      : props.price <= props.totalGreenGems;
  const wasClaimedToday = props.claimedDate === props.currentDate;
  const shouldDisableHover = !isClaimable || wasClaimedToday;

  return (
    <div
      className={`${styles.rewardCard} ${
        shouldDisableHover ? styles.noHoverEffect : ""
      }  rewardCard`}
      data-reward-id={props.id}
    >
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
        <p className={`${styles.rewardCardP}  rewardCardP`}>
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
            {wasClaimedToday ? (
              <div className={styles.claimedBadge}>Claimed Today</div>
            ) : isHovered && isClaimable ? (
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
                {props.price}
                <div
                  className={styles.gemIcon}
                  style={{
                    backgroundImage: `url('/images/${
                      props.currency || "blue-gem"
                    }.svg')`,
                    width: "20px",
                    height: "20px",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    marginLeft: "5px",
                  }}
                ></div>
              </button>
            )}
          </div>
        </div>
        <p className={styles.warning}>Not enough gems.</p>
      </div>
    </div>
  );
}
