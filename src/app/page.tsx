'use client';
// import { useState } from "react";
import styles from "./page.module.css";
import GoalsForToday from "./components/goalsForToday/GoalsForToday";
import Rewards from "./components/rewards/Rewards";

export default function Home() {
  // const [totalDiamonds, setTotalDiamonds] = useState<string>("");
  // setTotalDiamonds("eh");

  return (
    <div className={styles.page} >
    <GoalsForToday/>
    {/* <Rewards totalDiamonds={totalDiamonds}/> */}
    <Rewards totalDiamonds={'eh'}/>
    
    </div>
  );
}