import styles from "./page.module.css";
import GoalsForToday from "./components/goalsForToday/GoalsForToday";
import Rewards from "./components/rewards/Rewards";

export default function Home() {
  return (
    <div className={styles.page} >
    <GoalsForToday/>
    <Rewards/>
    </div>
  );
}