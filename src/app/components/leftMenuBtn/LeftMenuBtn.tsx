import Link from "next/link";
import styles from "./LeftMenuBtn.module.css";
import {
  MdHome,
  MdCheckCircle,
  MdFlag,
  MdAssignment,
  MdBook,
} from "react-icons/md";

const iconMap = {
  "/": MdHome,
  habits: MdCheckCircle,
  quests: MdFlag,
  todo: MdAssignment,
  journal: MdBook,
};

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
  const Icon = iconMap[id as keyof typeof iconMap];

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
        title={title}
      >
        <Icon size={24} />
      </button>
    </Link>
  );
}
