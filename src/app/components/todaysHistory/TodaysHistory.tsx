import { useState } from "react";
import styles from "./TodaysHistory.module.css";
import { TodaysHistoryI } from "../../helpers/interfaces";
import { useDiamonds } from "../../context/DiamondsContext";

// Use the existing interface from your project
// Define GroupedHistoryItems based on TodaysHistoryI
interface GroupedHistoryItems {
  [key: string]: TodaysHistoryI[] | undefined;
}

export default function TodaysHistory() {
  const { todaysHistory } = useDiamonds();
  const [isExpanded, setIsExpanded] = useState(true);

  // Group items by type for better organization with proper typing
  const historyByType = todaysHistory.reduce<GroupedHistoryItems>(
    (acc, item) => {
      // Using type assertion to ensure TypeScript knows the type exists
      const itemType = item.type;
      if (!acc[itemType]) {
        acc[itemType] = [];
      }

      if (acc[itemType]) {
        acc[itemType]?.push(item);
      }

      return acc;
    },
    {}
  );

  return (
    <div className={styles.container}>
      {/* Header with toggle */}
      <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div className={styles.headerTitle}>
          <div className={styles.clockIcon}></div>
          <h3>ACTIVITY LOG</h3>
        </div>
        <div
          className={isExpanded ? styles.chevronUp : styles.chevronDown}
        ></div>
      </div>

      {/* Collapsible content */}
      {isExpanded && (
        <div className={styles.content}>
          {todaysHistory.length === 0 ? (
            <div className={styles.emptyState}>No activity recorded today</div>
          ) : (
            <div className={styles.activitiesWrapper}>
              {/* Goals section */}
              {historyByType.goal && historyByType.goal.length > 0 && (
                <div className={styles.categorySection}>
                  <div className={styles.categoryHeader}>
                    <div
                      className={`${styles.categoryMarker} ${styles.goalMarker}`}
                    ></div>
                    <span className={styles.categoryTitle}>Goals</span>
                  </div>
                  {historyByType.goal.map((item, index) => (
                    <div key={`goal-${index}`} className={styles.activityItem}>
                      <div
                        className={`${styles.iconWrapper} ${styles.goalIcon}`}
                      ></div>
                      <div className={styles.activityText}>{item.title}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Rewards section */}
              {historyByType.reward && historyByType.reward.length > 0 && (
                <div className={styles.categorySection}>
                  <div className={styles.categoryHeader}>
                    <div
                      className={`${styles.categoryMarker} ${styles.rewardMarker}`}
                    ></div>
                    <span className={styles.categoryTitle}>Rewards</span>
                  </div>
                  {historyByType.reward.map((item, index) => (
                    <div
                      key={`reward-${index}`}
                      className={styles.activityItem}
                    >
                      <div
                        className={`${styles.iconWrapper} ${styles.rewardIcon}`}
                      ></div>
                      <div className={styles.activityText}>{item.title}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Habits section */}
              {historyByType.habit && historyByType.habit.length > 0 && (
                <div className={styles.categorySection}>
                  <div className={styles.categoryHeader}>
                    <div
                      className={`${styles.categoryMarker} ${styles.habitMarker}`}
                    ></div>
                    <span className={styles.categoryTitle}>Habits</span>
                  </div>
                  {historyByType.habit.map((item, index) => (
                    <div key={`habit-${index}`} className={styles.activityItem}>
                      <div
                        className={`${styles.iconWrapper} ${styles.habitIcon}`}
                      ></div>
                      <div className={styles.activityText}>{item.title}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
