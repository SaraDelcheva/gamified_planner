import styles from "./ShopItem.module.css";
import { RewardCardI } from "@/app/helpers/interfaces";
import { AiFillHeart } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";

export default function ShopItem(props: RewardCardI) {
  const isClaimable =
    props.price !== null &&
    (props.currency === "sapphire"
      ? props.price <= props.totalBlueGems
      : props.currency === "crystal"
      ? props.price <= props.totalPinkGems
      : props.currency === "ruby"
      ? props.price <= props.totalRedGems
      : props.price <= props.totalGreenGems);

  const wasClaimedToday = props.claimedDate === props.currentDate;

  // Allow interaction if:
  // 1. Item is not claimed today AND
  // 2. Either it's affordable OR it's already selected (for deselection)
  const canInteract = !wasClaimedToday && (isClaimable || props.isSelected);

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

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (props.handleIsWishListed) {
      const divEvent = {
        ...e,
        currentTarget: e.currentTarget.parentElement as HTMLDivElement,
      };
      props.handleIsWishListed(divEvent as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      className={`${styles.shopItem} ${getGemColorClass()} ${
        props.isSelected ? styles.selected : ""
      } ${!canInteract ? styles.disabled : ""}`}
      data-reward-id={props.id}
      onClick={() => {
        if (canInteract) {
          props.onSelect?.(props.id);
        }
      }}
      style={{
        cursor: canInteract ? "pointer" : "not-allowed",
        opacity: !canInteract ? 0.6 : 1,
      }}
    >
      <div
        className={styles.rewardImage}
        style={{
          backgroundImage: `url('/images/rewards/${
            props.cover ? props.cover : "reward"
          }.svg')`,
        }}
      />

      <div className={styles.rewardInfo}>
        <h3 className={styles.rewardName}>{props.rewardName}</h3>

        <div className={styles.priceContainer}>
          <span className={styles.price}>{props.price ?? 0}</span>
          <div
            className={styles.gemIcon}
            style={{
              backgroundImage: `url('/images/${
                props.currency || "sapphire"
              }.svg')`,
            }}
          />
        </div>

        <div className={styles.actions}>
          {canInteract ? (
            <div className={styles.selectionIndicator}>
              {props.isSelected ? (
                <FaCheck className={styles.checkIcon} />
              ) : (
                <div className={styles.checkbox} />
              )}
            </div>
          ) : (
            <div className={styles.statusText}>
              {wasClaimedToday ? "Claimed" : "Not enough gems"}
            </div>
          )}

          <button
            className={`${styles.wishlistButton} ${
              props.isWishListed ? styles.active : ""
            }`}
            onClick={handleWishlistClick}
          >
            <AiFillHeart />
          </button>
        </div>
      </div>
    </div>
  );
}
