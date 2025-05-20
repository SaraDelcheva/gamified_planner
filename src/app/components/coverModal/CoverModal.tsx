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
  const imageNames: string[] = [
    "book",
    "coffee",
    "food",
    "icecream",
    "meditate",
    "movie",
    "reward",
    "sleep",
    "videogames",
    "workout",
  ];
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
              style={{
                backgroundImage: `url(/images/rewards/${imageName}.svg)`,
              }}
            ></div>
          ))}
        </div>
        <div className={styles.addCancelContainer}>
          <AddOrCancelBtn
            onAdd={() => {
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
    </div>
  );
}
