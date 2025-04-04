import Link from "next/link";
import styles from "./LeftMenuBtn.module.css";

export default function LeftMenuBtn({
  title,
  id,
  selected,
  setSelected,
}: {
  title: string;
  id: string;
  selected: string;
  setSelected: (id: string) => void;
}) {
  const handleClick = () => {
    setSelected(id);
  };

  return (
    <Link href={id} legacyBehavior>
      <button
        id={id}
        className={`${styles.leftMenuBtn} ${
          selected === id ? styles.selected : ""
        }`}
        onClick={handleClick}
      >
        {title}
      </button>
    </Link>
  );
}
