"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import GoalsForToday from "./components/goalsForToday/GoalsForToday";
import Rewards from "./components/rewards/Rewards";

export default function Home() {
  const [totalDiamonds, setTotalDiamonds] = useState<number>(0);

  useEffect(() => {
    console.log("yayy");
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();
      setTotalDiamonds(data.totalDiamonds);
    }

    fetchData();
    console.log("gayy");
  }, []);

  return (
    <div className={styles.page}>
      <GoalsForToday setTotalDiamonds={setTotalDiamonds} />
      <Rewards totalDiamonds={totalDiamonds} />
    </div>
  );
}
