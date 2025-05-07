import styles from "./PersonalInfo.module.css";
import { useDiamonds } from "../../context/DiamondsContext";

export default function PersonalInfo({
  goalNumber,
  completedGoalNumber,
  notCompletedGoalNumber,
}: {
  goalNumber: number;
  completedGoalNumber: number;
  notCompletedGoalNumber: number;
}) {
  const {
    todaysHistory,
    totalBlueGems,
    totalRedGems,
    totalGreenGems,
    totalPinkGems,
  } = useDiamonds();

  return (
    <div className={styles.personalInfo}>
      <div className={styles.personalInfoContainer}>
        <div className={styles.personalStatus}>
          <div className={styles.avatar}></div>
          <div className={styles.personalStatusDetails}>
            <div className={styles.totalDiamonds}>
              <div className={styles.totalDiamonds}>
                <div className={`${styles.gemCover} ${styles.blueGem}`}></div>
                <span className={styles.smallText}>{totalBlueGems}</span>
              </div>
              <div className={styles.totalDiamonds}>
                <div className={`${styles.gemCover} ${styles.redGem}`}></div>
                <span className={styles.smallText}>{totalRedGems}</span>
              </div>
            </div>
            <div className={styles.totalDiamonds}>
              <div className={styles.totalDiamonds}>
                <div className={`${styles.gemCover} ${styles.greenGem}`}></div>
                <span className={styles.smallText}>{totalGreenGems}</span>
              </div>
              <div className={styles.totalDiamonds}>
                <div className={`${styles.gemCover} ${styles.pinkGem}`}></div>
                <span className={styles.smallText}>{totalPinkGems}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.personalStatusDescription}>
          <div className={styles.personalStatusDescriptionUsername}>
            SuperPantsVerified
          </div>
          <div className={styles.personalStatusDescriptionBody}>
            You have <span className={styles.highlighted}>{goalNumber}</span>{" "}
            goals for today.
            <br />
            <span className={styles.highlighted}>
              {completedGoalNumber}
            </span>{" "}
            completed,{" "}
            <span className={styles.highlighted}>{notCompletedGoalNumber}</span>{" "}
            to go.
          </div>
        </div>

        <div className={styles.todaysHistory}>
          <div className={styles.todaysHistoryHeader}>
            TODAY&apos;S HISTORY:
          </div>
          <div className={styles.todaysHistoryContainer}>
            {todaysHistory.length !== 0 &&
              todaysHistory.map((item, index) => (
                <div key={index} className={styles.historyItem}>
                  {item.type === "goal" && (
                    <div className={`${styles.goal}`}>
                      <div className={styles.claimedGoalCover}></div>
                      <div>Completed goal: {item.title}</div>
                    </div>
                  )}
                  {item.type === "reward" && (
                    <div className={`${styles.reward}`}>
                      <div className={styles.claimedRewardCover}></div>
                      <div>Claimed reward: {item.title}</div>
                    </div>
                  )}
                  {item.type === "habit" && (
                    <div className={`${styles.goal}`}>
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
