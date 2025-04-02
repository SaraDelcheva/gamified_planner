"use client";

import { useState, useEffect } from "react";
import { Geist, Geist_Mono, Inter, Karla } from "next/font/google";
import LeftMenu from "./components/leftMenu/LeftMenu";
import Rewards from "./components/rewards/Rewards";
import { RewardI, TodaysHistoryI } from "./helpers/interfaces";
import { saveData, createDates } from "./helpers/functions";
import { v4 as uuidv4 } from "uuid";
import "./globals.css";
import Wishlist from "./components/wishlist/Wishlist";
import { DiamondsProvider, useDiamonds } from "./context/DiamondsContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "400", "700"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function RewardContent() {
  const { totalDiamonds, setTotalDiamonds } = useDiamonds();
  const [rewards, setRewards] = useState<RewardI[]>([]);
  const [rewardName, setRewardName] = useState<string>("");
  const [rewardPrice, setRewardPrice] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [coverName, setCoverName] = useState<string>("reward.png");
  const [todaysHistory, setTodaysHistory] = useState<TodaysHistoryI[]>([]);
  const dates = createDates(0, 1);

  // ---------- Data Fetching ----------
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();

      setRewards(Array.isArray(data.rewards) ? data.rewards : []);
      setTodaysHistory(data.todaysHistory ? data.todaysHistory : []);
    }

    fetchData();
  }, []);

  // ---------- Handlers for Reward Management ----------
  //Add a New Reward
  function addNewReward() {
    if (rewardPrice === null || !rewardName.trim()) return;

    const updatedRewards = [
      ...rewards,
      {
        title: rewardName,
        diamonds: rewardPrice,
        isWishListed: false,
        cover: coverName,
        id: uuidv4(),
      },
    ];
    setRewards(updatedRewards);
    saveData({ rewards: updatedRewards });
    setCoverName("reward.png");
    setRewardName("");
    setRewardPrice(null);
  }

  //Claim Reward
  function claimReward(e: React.MouseEvent<HTMLButtonElement>) {
    const claimableRewards = rewards.filter(
      (reward) => reward.diamonds && reward.diamonds <= totalDiamonds
    );
    if (!claimableRewards.length) return;

    const button = e.target as HTMLButtonElement;
    const claimedReward = rewards.filter(
      (reward) => reward.id === button.parentElement?.parentElement?.id
    );
    const updatedRewards = rewards.filter(
      (reward) => reward.id !== claimedReward[0].id
    );

    const newTotalDiamonds = totalDiamonds - claimedReward[0].diamonds!;

    const newHistory = [
      ...todaysHistory,
      {
        date: dates[0].formattedDate,
        type: "reward",
        title: claimedReward[0].title,
        cover: claimedReward[0].cover,
      },
    ];

    setTodaysHistory(newHistory);
    setRewards(updatedRewards);
    setTotalDiamonds(newTotalDiamonds);

    saveData({
      rewards: updatedRewards,
      totalDiamonds: newTotalDiamonds,
      todaysHistory: newHistory,
    });
  }

  //handle is wishlisted
  function handleIsWishListed(e: React.MouseEvent<HTMLDivElement>) {
    const rewardId = e.currentTarget.parentElement?.parentElement?.id;
    const updatedRewards = rewards.map((reward) =>
      reward.id === rewardId
        ? { ...reward, isWishListed: !reward.isWishListed }
        : reward
    );

    setRewards(updatedRewards);
    saveData({ rewards: updatedRewards });
  }

  return (
    <>
      <Wishlist {...{ rewards, claimReward, handleIsWishListed }} />
      <Rewards
        {...{
          rewards,
          rewardName,
          rewardPrice,
          isModalOpen,
          setIsModalOpen,
          InputChange: (e) => setRewardName(e.target.value),
          DiamondChange: (e) => {
            e.preventDefault();
            setRewardPrice(
              e.target.value.trim() === "" ? null : Number(e.target.value)
            );
          },
          addNewReward,
          claimReward,
          coverName,
          setCoverName,
          handleIsWishListed,
        }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${karla.variable}`}
      >
        <DiamondsProvider>
          <LeftMenu />
          {children}
          <RewardContent />
        </DiamondsProvider>
      </body>
    </html>
  );
}
