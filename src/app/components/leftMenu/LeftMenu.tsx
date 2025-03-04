import styles from "./leftMenu.module.css";
import LeftMenuBtn from "../leftMenuBtn/LeftMenuBtn";

export default function LeftMenu() {
  return (
    <div className={styles.leftMenu}>
      <LeftMenuBtn title="Home" id="/" />
      <LeftMenuBtn title="Quests" id="quests" />
      <LeftMenuBtn title="To Do" id="todo" />
      <LeftMenuBtn title="Journal" id="journal" />
    </div>
  );
}
