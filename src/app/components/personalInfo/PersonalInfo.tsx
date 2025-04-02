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
      <div className="header">SuperPantsVerified</div>
      <div className={styles.personalInfoContainer}>
        <div className={styles.personalStatus}>
          <div className={styles.avatar}></div>
          <div className={styles.personalStatusDetails}>
            <div className={styles.treasurebox}></div>
            <div>Total Diamonds:</div>
            <div className={styles.totalDiamonds}>
              <IoDiamondOutline /> {totalDiamonds}
            </div>
          </div>
        </div>
        <div className={styles.todaysHistory}>
          <div className={styles.todaysHistoryHeader}>
            TODAY&apos;S HISTORY:
          </div>
          <div className={styles.todaysHistoryContainer}>
            {todaysHistory.map((item, index) => (
              <div key={index} className={styles.historyItem}>
                {item.type === "goal" && (
                  <div
                    className={`${styles.goal}  boxShadow ${styles.historyItem}`}
                  >
                    <div className={styles.claimedGoalCover}></div>
                    <div>Completed goal: {item.title}</div>
                  </div>
                )}
                {item.type === "reward" && (
                  <div className={`${styles.reward} ${styles.historyItem}`}>
                    <div
                      className={styles.claimedRewardCover}
                      style={{
                        backgroundImage: `url('/images/${item.cover}')`,
                      }}
                    ></div>
                    <div>Claimed reward: {item.title} </div>
                  </div>
                )}
                {item.type === "habit" && (
                  <div
                    className={`${styles.goal}  boxShadow ${styles.historyItem}`}
                  >
                    <div className={styles.claimedHabitCover}></div>
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
