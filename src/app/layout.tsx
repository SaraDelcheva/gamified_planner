"use client";

import { useState, useEffect } from "react";
import { Geist, Geist_Mono, Inter, Karla } from "next/font/google";
import LeftMenu from "./components/leftMenu/LeftMenu";
import Rewards from "./components/rewards/Rewards";
import { RewardI } from "./helpers/interfaces";
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
  const {
    todaysHistory,
    setTodaysHistory,
    totalBlueGems,
    setTotalBlueGems,
    totalGreenGems,
    setTotalGreenGems,
    totalPinkGems,
    setTotalPinkGems,
    totalRedGems,
    setTotalRedGems,
  } = useDiamonds();
  const [rewards, setRewards] = useState<RewardI[]>([]);
  const [rewardName, setRewardName] = useState<string>("");
  const [rewardCurrency, setRewardCurrency] = useState<string>("sapphire");
  const [rewardPrice, setRewardPrice] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [coverName, setCoverName] = useState<string>("reward");
  const dates = createDates(0, 1);
  const today = dates[0].formattedDate;

  // ---------- Data Fetching ----------
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();

      setRewards(Array.isArray(data.rewards) ? data.rewards : []);
    }

    fetchData();
  }, []);

  useEffect(() => {
    function resetClaimedDates() {
      const today = dates[0].formattedDate;

      // Check if any rewards have claimed dates from previous days
      const needsReset = rewards.some(
        (reward) => reward.claimedDate && reward.claimedDate !== today
      );

      if (needsReset) {
        const updatedRewards = rewards.map((reward) => {
          // If claimed date is not today, reset it
          if (reward.claimedDate && reward.claimedDate !== today) {
            return { ...reward, claimedDate: undefined };
          }
          return reward;
        });

        setRewards(updatedRewards);
        saveData({ rewards: updatedRewards });
      }
    }

    resetClaimedDates();

    // const intervalId = setInterval(() => {
    //   const newDates = createDates(0, 1);
    //   if (newDates[0].formattedDate !== dates[0].formattedDate) {
    //     resetClaimedDates();
    //   }
    // }, 60000);

    // return () => clearInterval(intervalId);
  }, [rewards, dates]);

  // ---------- Handlers for Reward Management ----------
  //Add a New Reward
  function addNewReward() {
    if (rewardPrice === null || !rewardName.trim()) return;

    const updatedRewards = [
      ...rewards,
      {
        title: rewardName,
        price: rewardPrice,
        currency: rewardCurrency,
        cover: coverName,
        id: uuidv4(),
        isWishListed: false,
      },
    ];
    setRewards(updatedRewards);
    saveData({ rewards: updatedRewards });
    setCoverName("reward");
    setRewardName("");
    setRewardCurrency("sapphire");
    setRewardPrice(null);
  }

  // Check if a reward was claimed today
  function wasClaimedToday(reward: RewardI): boolean {
    if (!reward.claimedDate) return false;

    const today = dates[0].formattedDate;
    return reward.claimedDate === today;
  }

  //Claim Reward
  function claimReward(e: React.MouseEvent<HTMLButtonElement>) {
    const button = e.target as HTMLButtonElement;
    const rewardId =
      button.parentElement?.parentElement?.parentElement?.parentElement?.getAttribute(
        "data-reward-id"
      );

    const claimedReward = rewards.find((reward) => reward.id === rewardId);
    if (!claimedReward) return;

    if (!claimedReward.price || wasClaimedToday(claimedReward)) {
      return;
    }

    // Determine which gem type to deduct from based on the reward's currency
    let canAfford = false;
    switch (claimedReward.currency) {
      case "sapphire":
        canAfford = totalBlueGems >= claimedReward.price;
        break;
      case "ruby":
        canAfford = totalRedGems >= claimedReward.price;
        break;
      case "emerald":
        canAfford = totalGreenGems >= claimedReward.price;
        break;
      case "crystal":
        canAfford = totalPinkGems >= claimedReward.price;
        break;
    }

    if (!canAfford) {
      return;
    }
    let newTotalBlueGems = totalBlueGems;
    let newTotalRedGems = totalRedGems;
    let newTotalGreenGems = totalGreenGems;
    let newTotalPinkGems = totalPinkGems;

    switch (claimedReward.currency) {
      case "sapphire":
        newTotalBlueGems = totalBlueGems - claimedReward.price;
        setTotalBlueGems(newTotalBlueGems);
        break;
      case "ruby":
        newTotalRedGems = totalRedGems - claimedReward.price;
        setTotalRedGems(newTotalRedGems);
        break;
      case "emerald":
        newTotalGreenGems = totalGreenGems - claimedReward.price;
        setTotalGreenGems(newTotalGreenGems);
        break;
      case "crystal":
        newTotalPinkGems = totalPinkGems - claimedReward.price;
        setTotalPinkGems(newTotalPinkGems);
        break;
    }

    const updatedRewards = rewards.map((reward) =>
      reward.id === rewardId ? { ...reward, claimedDate: today } : reward
    );

    const newHistory = [
      ...todaysHistory,
      {
        date: dates[0].formattedDate,
        type: "reward",
        title: claimedReward.title,
        cover: claimedReward.cover,
      },
    ];

    setTodaysHistory(newHistory);
    setRewards(updatedRewards);

    saveData({
      rewards: updatedRewards,
      totalBlueGems: newTotalBlueGems,
      totalRedGems: newTotalRedGems,
      totalGreenGems: newTotalGreenGems,
      totalPinkGems: newTotalPinkGems,
      todaysHistory: newHistory,
    });
  }

  //handle is wishlisted
  function handleIsWishListed(e: React.MouseEvent<HTMLDivElement>) {
    const rewardId =
      e.currentTarget.parentElement?.parentElement?.getAttribute(
        "data-reward-id"
      );
    const updatedRewards = rewards.map((reward) =>
      reward.id === rewardId
        ? { ...reward, isWishListed: !reward.isWishListed }
        : reward
    );
    console.log(e.currentTarget.parentElement?.parentElement);

    setRewards(updatedRewards);
    saveData({ rewards: updatedRewards });
  }

  return (
    <>
      <Wishlist {...{ rewards, claimReward, handleIsWishListed, today }} />
      <Rewards
        {...{
          rewards,
          rewardName,
          rewardPrice,
          rewardCurrency,
          isModalOpen,
          setIsModalOpen,
          InputChange: (e) => setRewardName(e.target.value),
          PriceChange: (e) => {
            e.preventDefault();
            setRewardPrice(
              e.target.value.trim() === "" ? null : Number(e.target.value)
            );
          },
          currencyChange: (e) => {
            e.preventDefault();
            setRewardCurrency(e.target.value.trim() || "sapphire");
          },
          addNewReward,
          claimReward,
          coverName,
          setCoverName,
          handleIsWishListed,
          currentDate: today,
          totalBlueGems,
          totalRedGems,
          totalGreenGems,
          totalPinkGems,
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
          <div className="mainContent">{children}</div>
          <RewardContent />
        </DiamondsProvider>
      </body>
    </html>
  );
}
