"use client";
import { useState } from "react";
import styles from "./Rewards.module.css"
import RewardCard from "./rewardCard/RewardCard";
import AddNewReward from "./addNewReward/AddNewReward";

interface Rewards {
  title: string;
  diamonds: number | null;
  cover: string;
}

export default function Rewards() {
  const [rewards, setRewards] = useState<Rewards[]>([]);
  const [rewardName, setRewardName] = useState<string>("");
  const [coverName, setCoverName] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number | null>(null); 
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [imageName, setImageName] = useState<string>("");

  const imageNames: string[] = ['book.png', 'coffee.png'];

  const InputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRewardName(e.target.value);
  };

  const DiamondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim() === "" ? null : Number(e.target.value);
    setDifficulty(value);
  };
  
  function addNewReward() {
    if (difficulty === null || !rewardName.trim()) return; 
    
    setRewards((prevRewards) => [
      ...prevRewards,
      { title: rewardName, diamonds: difficulty !== null ? difficulty : null, cover: coverName } 
    ]);
  
    setRewardName("");
    setDifficulty(null);
  }

  return (
    <div className={styles.rewards}>
      <div className="header">
        <h1 className="headerH1">Rewards</h1>
      </div>
      <div className={styles.rewardsContainer}>
        {rewards.map((reward, index) => (
          <RewardCard key={index} rewardName = {reward.title} diamonds={reward.diamonds ?? 0}cover={reward.cover}/>
        ))} 
      <AddNewReward diamonds={difficulty} 
          newRewardName={rewardName} 
          addNewReward={addNewReward}
          handleInputChange={InputChange}
          handleInputDiamondChange={DiamondChange} 
          chooseRewardCover={() => setIsModalOpen(true)}
          imageName={imageName}/>
      </div>
      {isModalOpen  &&  <div className = {styles.modalContainer}>
        <div className = {styles.modalInner}>
        {imageNames.map((imageName, index) => (
              <div
                onClick = {()=> {setCoverName(imageName); setImageName(imageName); setIsModalOpen(false)}}
                key={index}
                className={styles.modalImage}
                style={{ backgroundImage: `url(/images/${imageName})` }}
              ></div>
        ))}
        </div>
      </div>
      }
    </div>
  );
}