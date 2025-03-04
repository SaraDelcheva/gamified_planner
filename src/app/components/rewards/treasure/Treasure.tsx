import styles from "./Treasure.module.css";


export default function Treasure({totalDiamonds}:{totalDiamonds:string}) {
    return (
    <div className={styles.treasure}>
   <div>{totalDiamonds}</div>
    </div>
    );
  } 