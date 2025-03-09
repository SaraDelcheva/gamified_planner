"use client";
import { useState } from "react";
import styles from "./AddCustomReward.module.css";
import { BiPlus } from "react-icons/bi";

export default function AddCustomReward({handleAddCustomReward}:{handleAddCustomReward: ()=> void}) {

  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className={styles.addCustomReward}>
      <button onClick={()=>setIsExpanded(true)} className={styles.addCustomRewardBtn}><BiPlus className={styles.plusIcon}/> Add Custom Reward</button>
      {isExpanded && 
      <div className={styles.expandedContent}>dick</div>
      }
    </div>
  );
}
