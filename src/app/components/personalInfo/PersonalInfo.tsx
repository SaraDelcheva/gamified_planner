import { TodaysHistoryI, RewardI } from "@/app/helpers/interfaces";
import styles from "./PersonalInfo.module.css";
import RewardCard from "../rewards/rewardCard/RewardCard";

interface PersonalInfoProps {
  todaysHistory: TodaysHistoryI[];
  rewards: RewardI[];
  totalDiamonds: number;
  claimReward: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleIsWishListed: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function PersonalInfo({
  todaysHistory,
  rewards,
  totalDiamonds,
  claimReward,
  handleIsWishListed,
}: PersonalInfoProps) {
  const wishlistedRewards = rewards.filter((reward) => reward.isWishListed);
  return (
    <div className={styles.personalInfo}>
      <div className={styles.personalInfoContainer}>
        <div className={styles.personalStatus}>
          <div className={styles.avatar}></div>
          <div className={styles.personalStatusDetails}></div>
        </div>
        <div className={styles.todaysHistory}>
          <div className={styles.todaysHistoryHeader}>
            Today&apos;s history:
          </div>
          <div className={styles.todaysHistoryContainer}>
            {todaysHistory.map((item, index) => (
              <div key={index} className={styles.historyItem}>
                {item.type === "goal" && (
                  <div
                    className={`${styles.goal}  boxShadow ${styles.historyItem}`}
                  >
                    <div>Completed goal: {item.title}</div>
                  </div>
                )}
                {item.type === "reward" && (
                  <div className={`${styles.reward} ${styles.historyItem}`}>
                    <div>Claimed reward: {item.title} </div>
                    <div
                      className={styles.claimedRewardCover}
                      style={{
                        backgroundImage: `url('/images/${item.cover}')`,
                      }}
                    ></div>
                  </div>
                )}
                {item.type === "habit" && (
                  <div
                    className={`${styles.goal}  boxShadow ${styles.historyItem}`}
                  >
                    <div>Completed habit: {item.title}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.wishlist}>
        <div className="header">Wishlist</div>
        {wishlistedRewards.map((reward) => (
          <div key={reward.id} className={styles.wishlistItem}>
            <RewardCard
              key={reward.id}
              rewardName={reward.title}
              diamonds={reward.diamonds ?? 0}
              cover={reward.cover}
              totalDiamonds={totalDiamonds}
              claimReward={claimReward}
              id={reward.id}
              handleIsWishListed={handleIsWishListed}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
