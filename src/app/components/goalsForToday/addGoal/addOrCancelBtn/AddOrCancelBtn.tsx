import styles from "./AddOrCancel.module.css";

export default function AddOrCancelBtn({
  onAdd,
  onCancel,
  addParam,
}: {
  onAdd: (param?: string) => void;
  onCancel: () => void;
  addParam?: string;
}) {
  return (
    <div className={styles.addOrCancelBtn}>
      <button className={styles.cancelBtn} onClick={onCancel}>
        Cancel
      </button>
      <button
        onClick={() => {
          onAdd(addParam);
        }}
        className={styles.addBtn}
      >
        Add
      </button>
    </div>
  );
}
