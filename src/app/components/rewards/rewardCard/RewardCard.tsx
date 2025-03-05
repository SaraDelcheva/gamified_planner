import styles from "./RewardCard.module.css";
import { IoDiamondOutline } from "react-icons/io5";

export default function RewardCard({
  rewardName,
  diamonds,
  cover,
}: {
  rewardName: string;
  diamonds: number;
  cover: string;
}) {
  return (
    <div className={styles.rewardCard}>
      <p className={styles.rewardCardP}>{rewardName}</p>
      <div
        className={styles.rewardCardImg}
        style={{
          backgroundImage: `url('/images/${cover ? cover : "reward.png"}')`,
        }}
      ></div>
      <button className={`${styles.newBtn} boxShadow`}>
        {diamonds} <IoDiamondOutline />
      </button>
    </div>
  );
}
