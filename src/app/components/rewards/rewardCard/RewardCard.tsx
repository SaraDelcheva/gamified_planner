import { useState } from "react";
import styles from "./RewardCard.module.css";
import { RewardCardI } from "@/app/helpers/interfaces";
import { AiFillHeart } from "react-icons/ai";

export default function RewardCard(props: RewardCardI) {
  const [isHovered, setIsHovered] = useState(false);

  const isClaimable =
    props.currency === "sapphire"
      ? props.price <= props.totalBlueGems
      : props.currency === "crystal"
      ? props.price <= props.totalPinkGems
      : props.currency === "ruby"
      ? props.price <= props.totalRedGems
      : props.price <= props.totalGreenGems;

  const wasClaimedToday = props.claimedDate === props.currentDate;
  const shouldDisableHover = !isClaimable || wasClaimedToday;

  // Calculate progress toward being able to claim the reward
  const getProgressPercentage = () => {
    if (isClaimable) return 100;

    const currentGems =
      props.currency === "sapphire"
        ? props.totalBlueGems
        : props.currency === "crystal"
        ? props.totalPinkGems
        : props.currency === "ruby"
        ? props.totalRedGems
        : props.totalGreenGems;

    return Math.min(Math.round((currentGems / props.price) * 100), 99);
  };

  const progressPercent = getProgressPercentage();

  // Get gem color class for visual cue
  const getGemColorClass = () => {
    switch (props.currency) {
      case "sapphire":
        return styles.blueGem;
      case "ruby":
        return styles.redGem;
      case "crystal":
        return styles.pinkGem;
      default:
        return styles.greenGem;
    }
  };

  return (
    <div
      className={`${styles.rewardCard} ${
        shouldDisableHover ? styles.noHoverEffect : ""
      } ${getGemColorClass()}`}
      data-reward-id={props.id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.rewardCardHeader}>
        <h3 className={styles.rewardCardTitle}>{props.rewardName}</h3>
        <div
          className={styles.wishlistToggle}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            props.handleIsWishListed(e);
          }}
        >
          <AiFillHeart
            className={styles.wishlistIcon}
            style={{ color: props.isWishListed ? "#ff6b6b" : "white" }}
          />
        </div>
      </div>

      <div className={styles.rewardCardInner}>
        <div
          className={styles.rewardCardImg}
          style={{
            backgroundImage: `url('/images/rewards/${
              props.cover ? props.cover : "reward"
            }.svg')`,
          }}
        ></div>

        <div className={styles.rewardCardInfo}>
          <div className={styles.priceTag}>
            <span>{props.price}</span>
            <div
              className={styles.gemIcon}
              style={{
                backgroundImage: `url('/images/${
                  props.currency || "sapphire"
                }.svg')`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          </div>

          <div className={styles.buttonContainer}>
            {wasClaimedToday ? (
              <div className={styles.claimedBadge}>Claimed Today</div>
            ) : isHovered && isClaimable ? (
              <button
                className={`${styles.claimBtn} boxShadow`}
                disabled={!isClaimable}
                onClick={props.claimReward}
              >
                Claim Reward
              </button>
            ) : (
              <button
                className={`${styles.newBtn} boxShadow`}
                disabled={!isClaimable}
                style={
                  !isClaimable
                    ? {
                        position: "relative",
                        overflow: "hidden",
                      }
                    : {}
                }
              >
                {!isClaimable && (
                  <div
                    className={styles.progressBar}
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                )}
                <span className={styles.buttonText}>
                  {isClaimable
                    ? "Ready to Claim"
                    : `${progressPercent}% Progress`}
                </span>
              </button>
            )}
          </div>

          {!isClaimable && (
            <p className={styles.warning}>
              Need{" "}
              {props.price -
                (props.currency === "sapphire"
                  ? props.totalBlueGems
                  : props.currency === "crystal"
                  ? props.totalPinkGems
                  : props.currency === "ruby"
                  ? props.totalRedGems
                  : props.totalGreenGems)}{" "}
              more {props.currency || "sapphire"} gems
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
