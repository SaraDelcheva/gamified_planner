import styles from "./PersonalInfo.module.css";

export default function PersonalInfo() {
  return (
    <div className={styles.personalInfo}>
      <div className={styles.personalStatus}>
        <div className={styles.avatar}></div>
        <div className={styles.todaysHistory}>
          <div>Today&apos;s history</div>
        </div>
      </div>
    </div>
  );
}
