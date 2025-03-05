import { useState } from "react";
import styles from "./RewardCard.module.css";
import { IoDiamondOutline } from "react-icons/io5";

export default function RewardCard({
  rewardName,
  diamonds,
  cover,
  totalDiamonds,
}: {
  rewardName: string;
  diamonds: number;
  cover: string;
  totalDiamonds: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isClaimable = diamonds <= totalDiamonds;

  return (
    <div className={styles.rewardCard}>
      <p className={styles.rewardCardP}>{rewardName}</p>
      <div
        className={styles.rewardCardImg}
        style={{
          backgroundImage: `url('/images/${cover ? cover : "reward.png"}')`,
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
          >
            Claim
          </button>
        ) : (
          <button
            className={`${styles.newBtn} boxShadow`}
            disabled={!isClaimable}
          >
            {diamonds} <IoDiamondOutline />
          </button>
        )}
      </div>
    </div>
  );
}
