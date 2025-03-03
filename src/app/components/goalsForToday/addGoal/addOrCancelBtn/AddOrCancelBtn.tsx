import styles from "./AddOrCancel.module.css";
import { AiOutlineClose } from "react-icons/ai"
import { FaPlay } from "react-icons/fa"; 

export default function AddOrCancelBtn({ addNewGoal} : {addNewGoal:() => void}) {
    return (
    <div className={styles.addOrCancelBtn}>
      <button className={styles.cancelBtn}><AiOutlineClose/></button>
      <button  onClick={() => {
          addNewGoal();
        }} className={styles.addBtn}><FaPlay/></button>
    </div>
    );
  } 