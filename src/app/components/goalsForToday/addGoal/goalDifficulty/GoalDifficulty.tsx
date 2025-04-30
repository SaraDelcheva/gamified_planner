import styles from "./GoalDifficulty.module.css";

export default function GoalDifficulty({
  difficultyLevel,
  diamonds,
  easy,
  currency,
  selectedDifficulty,
}: {
  difficultyLevel: string;
  diamonds: number;
  easy: (diamonds: number) => void;
  currency?: string;
  selectedDifficulty: number;
}) {
  return (
    <div
      className={`${styles.difficultyOption} ${
        selectedDifficulty === diamonds ? styles.selectedDifficulty : ""
      }`}
      onClick={() => easy(diamonds)}
    >
      <p className={styles.diamondsP}>{difficultyLevel}</p>{" "}
      <div className={`${styles.difficultyBadge} ${styles.boxShadow}`}>
        <span>{diamonds}</span>
        <div
          className={styles.gemIcon}
          style={{
            backgroundImage: `url('/images/${currency}.svg')`,
          }}
        ></div>
      </div>
    </div>
  );
}
