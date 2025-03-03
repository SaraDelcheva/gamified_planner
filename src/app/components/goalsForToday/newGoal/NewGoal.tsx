import styles from "./NewGoal.module.css";
import { IoDiamondOutline } from "react-icons/io5"; 

export default function NewGoal({goalTitle, diamonds}:{goalTitle:string, diamonds:number}) {

  return (
    <div className={styles.newGoal}>
    <div className={styles.newGoalHeader}>
    <p className={styles.newGoalP}>{goalTitle}</p>
      <button
        className={`${styles.newBtn} boxShadow`}
      >
    {diamonds} <IoDiamondOutline  />
      </button>  
    </div>
    </div> 
  );
}
