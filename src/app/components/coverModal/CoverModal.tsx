"use client";
import { useState } from "react";
import styles from "./CoverModal.module.css";
import AddOrCancelBtn from "../goalsForToday/addGoal/addOrCancelBtn/AddOrCancelBtn";

export default function CoverModal({
  coverName,
  setCoverName,
  setIsModalOpen,
}: {
  coverName: string;
  setCoverName: React.Dispatch<React.SetStateAction<string>>;
  setIsModalOpen: (isModalOpen: boolean) => void;
}) {
  const imageNames: string[] = ["reward.png", "book.png", "coffee.png"];
  const [tempCoverName, setTempCoverName] = useState<string>(coverName);
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalInner}>
        <div className="header">Choose Cover Image</div>
        <div className={styles.modalImagesContainer}>
          {imageNames.map((imageName, index) => (
            <div
              onClick={() => {
                setTempCoverName(imageName);
              }}
              key={index}
              className={`${styles.modalImage} ${
                tempCoverName === imageName ? styles.selected : ""
              }`}
              style={{ backgroundImage: `url(/images/${imageName})` }}
            ></div>
          ))}
        </div>
        <AddOrCancelBtn
          addNewGoal={() => {
            setCoverName(tempCoverName);
            setIsModalOpen(false);
          }}
          onCancel={() => {
            setTempCoverName(coverName);
            setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}
