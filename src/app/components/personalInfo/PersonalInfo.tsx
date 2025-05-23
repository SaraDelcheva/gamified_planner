<<<<<<< HEAD
import React from "react";
=======
>>>>>>> e14153ba64537d67a93bd88a0f36266a59881829
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
<<<<<<< HEAD
  const { totalBlueGems, totalRedGems, totalGreenGems, totalPinkGems } =
    useDiamonds();
=======
  const {
    todaysHistory,
    totalBlueGems,
    totalRedGems,
    totalGreenGems,
    totalPinkGems,
  } = useDiamonds();
>>>>>>> e14153ba64537d67a93bd88a0f36266a59881829

  // Find today's focus goal
  const todaysFocusGoal = goals.find(
    (goal) => goal.priority === "Today's focus"
  );

<<<<<<< HEAD
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
=======
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
>>>>>>> e14153ba64537d67a93bd88a0f36266a59881829
              </div>
            </div>
          </div>
        </div>
<<<<<<< HEAD

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
=======
        <div className={styles.personalStatusDescription}>
          <div className={styles.personalStatusDescriptionUsername}>
            SuperPantsVerified
          </div>
          <div className={styles.personalStatusDescriptionBody}>
            <div className={styles.todaysFocusSection}>
              Today&apos;s focus:{" "}
              {todaysFocusGoal ? (
                <span className={styles.focusGoalTitle}>
                  {todaysFocusGoal.title}
                </span>
              ) : (
                <span className={styles.noFocusGoal}>No focus set</span>
              )}
            </div>
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
>>>>>>> e14153ba64537d67a93bd88a0f36266a59881829
          </div>
        </div>
      </div>
    </div>
  );
}
