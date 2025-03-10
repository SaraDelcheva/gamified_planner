import { useState } from "react";
import styles from "./RewardCard.module.css";
import { IoDiamondOutline } from "react-icons/io5";
import { RewardCardI } from "@/app/helpers/interfaces";

export default function RewardCard(props: RewardCardI) {
  const [isHovered, setIsHovered] = useState(false);
  const isClaimable = props.diamonds <= props.totalDiamonds;

  return (
    <div className={styles.rewardCard} id={props.id}>
      <p className={styles.rewardCardP}>{props.rewardName}</p>
      <div
        className={styles.rewardCardImg}
        style={{
          backgroundImage: `url('/images/${
            props.cover ? props.cover : "reward.png"
          }')`,
        }}
      ></div>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && isClaimable ? (
          <button
            className={`${styles.claimBtn} boxShadow`}
            disabled={!isClaimable}
            onClick={props.claimReward}
          >
            Claim
          </button>
        ) : (
          <button
            className={`${styles.newBtn} boxShadow`}
            disabled={!isClaimable}
          >
            {props.diamonds} <IoDiamondOutline />
          </button>
        )}
      </div>
    </div>
  );
}
