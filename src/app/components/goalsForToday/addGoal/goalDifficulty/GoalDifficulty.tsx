import styles from "./GoalDifficulty.module.css";
import { IoDiamondOutline } from "react-icons/io5";

export default function GoalDifficulty({
  difficultyLevel,
  diamonds,
  easy,
}: {
  difficultyLevel: string;
  diamonds: number;
  easy: (diamonds: number) => void;
}) {
  return (
    <div className={styles.difficulty} onClick={() => easy(diamonds)}>
      <p>{difficultyLevel}</p>
      <div className={`${styles.diamonds} boxShadow`}>
        <p className={styles.diamondsP}>{diamonds}</p> <IoDiamondOutline />
      </div>
    </div>
  );
}
