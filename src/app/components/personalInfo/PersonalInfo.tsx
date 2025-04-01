import { TodaysHistoryI } from "@/app/helpers/interfaces";
import styles from "./PersonalInfo.module.css";

import { IoDiamondOutline } from "react-icons/io5";

interface PersonalInfoProps {
  todaysHistory: TodaysHistoryI[];
  totalDiamonds: number;
}

export default function PersonalInfo({
  todaysHistory,
  totalDiamonds,
}: PersonalInfoProps) {
  return (
    <div className={styles.personalInfo}>
      <div className={styles.personalInfoContainer}>
        <div className={styles.personalStatus}>
          <div className={styles.avatar}></div>
          <div className={styles.personalStatusDetails}>
            <IoDiamondOutline /> {totalDiamonds}
          </div>
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
    </div>
  );
}
