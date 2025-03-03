import Link from 'next/link';
import styles from "./LeftMenuBtn.module.css";

export default function LeftMenuBtn({ title, id}: { title: string; id: string}) {
    return (
      <Link href={id}>
      <button id={id} className={styles.leftMenuBtn}>
        {title}
      </button>
    </Link>
    );
  }