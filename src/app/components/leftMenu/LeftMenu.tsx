import { useState } from "react";
import styles from "./leftMenu.module.css";
import LeftMenuBtn from "../leftMenuBtn/LeftMenuBtn";

export default function LeftMenu() {
  const [selected, setSelected] = useState("/"); // Default to home

  return (
    <div className={styles.leftMenu}>
      <LeftMenuBtn
        title="HOME"
        id="/"
        selected={selected}
        setSelected={setSelected}
      />
      <LeftMenuBtn
        title="HABITS"
        id="habits"
        selected={selected}
        setSelected={setSelected}
      />
      <LeftMenuBtn
        title="QESTS"
        id="quests"
        selected={selected}
        setSelected={setSelected}
      />
      <LeftMenuBtn
        title="TO DO"
        id="todo"
        selected={selected}
        setSelected={setSelected}
      />
      <LeftMenuBtn
        title="JOURNAL"
        id="journal"
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
}
