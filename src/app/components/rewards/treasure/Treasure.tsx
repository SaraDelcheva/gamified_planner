import styles from "./Treasure.module.css";
import { IoDiamondOutline } from "react-icons/io5";

export default function Treasure({ totalDiamonds }: { totalDiamonds: number }) {
  return (
    <div className={styles.treasure}>
      <div className={styles.totalDiamonds}>
        {totalDiamonds}
        <IoDiamondOutline />
      </div>
    </div>
  );
}
