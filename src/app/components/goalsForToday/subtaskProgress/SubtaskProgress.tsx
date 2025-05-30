import { SubtaskI } from "@/app/helpers/interfaces";
import styles from "./SubtaskProgress.module.css";

interface SubtaskProgressProps {
  subtasks: SubtaskI[];
}

export default function SubtaskProgress({ subtasks }: SubtaskProgressProps) {
  if (subtasks.length === 0) return null;

  const completedCount = subtasks.filter(
    (subtask) => subtask.isCompleted
  ).length;
  const isAllCompleted =
    completedCount === subtasks.length && subtasks.length > 0;

  return (
    <div className={styles.progressCircle}>
      <svg width="20" height="20" style={{ transform: "rotate(-90deg)" }}>
        {/* Background circle */}
        <circle
          cx="10"
          cy="10"
          r="8"
          fill="none"
          stroke="var(--surface-hover)"
          strokeWidth="2"
        />
        {/* Progress circle */}
        <circle
          cx="10"
          cy="10"
          r="8"
          fill="none"
          stroke={isAllCompleted ? "var(--accent)" : "var(--text-muted)"}
          strokeWidth="2"
          strokeDasharray={2 * Math.PI * 8}
          strokeDashoffset={
            2 * Math.PI * 8 -
            (completedCount / subtasks.length) * 2 * Math.PI * 8
          }
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.3s ease, stroke 0.3s ease",
          }}
        />
      </svg>
      {/* Completion checkmark */}
      {isAllCompleted && <div className={styles.completionCheck}>✓</div>}
    </div>
  );
}
