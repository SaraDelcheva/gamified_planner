import React from "react";
import styles from "./PersonalInfo.module.css";
import { useDiamonds } from "../../context/DiamondsContext";
import { GoalI } from "../../helpers/interfaces";

export default function PersonalInfo({
  goalNumber,
  completedGoalNumber,
  notCompletedGoalNumber,
  goals,
}: {
  goalNumber: number;
  completedGoalNumber: number;
  notCompletedGoalNumber: number;
  goals: GoalI[];
}) {
  const { totalBlueGems, totalRedGems, totalGreenGems, totalPinkGems } =
    useDiamonds();

  // Find today's focus goal
  const todaysFocusGoal = goals.find(
    (goal) => goal.priority === "Today's focus"
  );

  // Calculate progress percentage
  const progressPercentage =
    goalNumber > 0 ? Math.round((completedGoalNumber / goalNumber) * 100) : 0;

  return (
    <div className={styles.personalInfo}>
      <div className={styles.personalInfoContainer}>
        {/* Profile section with avatar and gems */}
        <div className={styles.profileSection}>
          <div className={styles.profileAvatar}></div>
          <div className={styles.profileInfo}>
            <div className={styles.username}>
              SuperPants
              <span className={styles.verifiedBadge}></span>
            </div>

            <div className={styles.gemsDisplay}>
              <div className={styles.gemGroup}>
                <div className={`${styles.gem} ${styles.blueGem}`}></div>
                <span className={styles.gemValue}>{totalBlueGems}</span>
              </div>

              <div className={styles.gemGroup}>
                <div className={`${styles.gem} ${styles.redGem}`}></div>
                <span className={styles.gemValue}>{totalRedGems}</span>
              </div>

              <div className={styles.gemGroup}>
                <div className={`${styles.gem} ${styles.greenGem}`}></div>
                <span className={styles.gemValue}>{totalGreenGems}</span>
              </div>

              <div className={styles.gemGroup}>
                <div className={`${styles.gem} ${styles.pinkGem}`}></div>
                <span className={styles.gemValue}>{totalPinkGems}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats card */}
        <div className={styles.statsCard}>
          <div className={styles.statsContent}>
            <div className={styles.focusSection}>
              <div className={styles.focusLabel}>TODAY&apos;S FOCUS</div>
              {todaysFocusGoal ? (
                <div className={styles.focusValue}>{todaysFocusGoal.title}</div>
              ) : (
                <div className={styles.noFocus}>No focus set</div>
              )}
            </div>

            <div className={styles.goalStats}>
              <div className={styles.goalTotal}>
                You have{" "}
                <span className={styles.highlighted}>{goalNumber}</span> goals
                today
              </div>

              <div className={styles.goalProgress}>
                <div className={styles.progressText}>
                  <span className={styles.completed}>
                    {completedGoalNumber}
                  </span>{" "}
                  completed,
                  <span className={styles.remaining}>
                    {" "}
                    {notCompletedGoalNumber}
                  </span>{" "}
                  remaining
                </div>
              </div>

              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
