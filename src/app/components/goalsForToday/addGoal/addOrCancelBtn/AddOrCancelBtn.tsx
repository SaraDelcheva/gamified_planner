import styles from "./AddOrCancel.module.css";
import { AiOutlineClose } from "react-icons/ai"
import { FaPlay } from "react-icons/fa"; 

export default function AddOrCancelBtn({ addNewGoal, onCancel} : {addNewGoal:() => void, onCancel: () => void }) {
    return (
    <div className={styles.addOrCancelBtn}>
      <button className={styles.cancelBtn} onClick={onCancel}><AiOutlineClose/></button>
      <button  onClick={() => {
          addNewGoal();
        }} className={styles.addBtn}><FaPlay/></button>
    </div>
    );
  } 