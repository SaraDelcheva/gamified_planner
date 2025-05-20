"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./Wishlist.module.css";
import { RewardI } from "@/app/helpers/interfaces";
import RewardCard from "../rewards/rewardCard/RewardCard";
import { AiFillHeart, AiOutlineInbox } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { useDiamonds } from "@/app/context/DiamondsContext";

interface WishlistProps {
  rewards: RewardI[];
  claimReward: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleIsWishListed: (e: React.MouseEvent<HTMLDivElement>) => void;
  today: string;
}

export default function Wishlist(props: WishlistProps) {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const wishlistRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  const { totalBlueGems, totalRedGems, totalGreenGems, totalPinkGems } =
    useDiamonds();

  // Filter out wishlisted rewards
  const wishlistedRewards = props.rewards.filter(
    (reward) => reward.isWishListed
  );

  // Check if we're on mobile when the component mounts
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for resizing
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Handle click outside to close wishlist
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isWishlistOpen &&
        wishlistRef.current &&
        !wishlistRef.current.contains(target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(target)
      ) {
        setIsWishlistOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isWishlistOpen]);

  const toggleWishlist = () => {
    setIsWishlistOpen(!isWishlistOpen);
  };

  return (
    <>
      {/* Wishlist Toggle Button */}
      <button
        ref={toggleBtnRef}
        className={styles.wishlistToggleBtn}
        onClick={toggleWishlist}
        aria-label="Toggle Wishlist"
      >
        <AiFillHeart />
        <span className={styles.badge}>
          {wishlistedRewards.length > 0 ? wishlistedRewards.length : ""}
        </span>
      </button>

      {/* Wishlist Panel */}
      <div
        ref={wishlistRef}
        className={`${styles.wishlist} ${
          isWishlistOpen ? styles.wishlistOpen : ""
        }`}
      >
        <div className={styles.wishlistHeader}>
          <div className={styles.wishlistTitle}>
            <AiFillHeart />
            WISHLIST
          </div>

          <button
            className={styles.closeButton}
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close Wishlist"
          >
            <FaTimes />
          </button>

          {/* Only show gem counters on mobile */}
          {isMobile && (
            <div className={styles.gemsCounter}>
              <div className={`${styles.gemItem} ${styles.blueGem}`}>
                <div
                  className={styles.gemIcon}
                  style={{ backgroundImage: "url('/images/sapphire.svg')" }}
                ></div>
              </div>

              <div className={`${styles.gemItem} ${styles.redGem}`}>
                <div
                  className={styles.gemIcon}
                  style={{ backgroundImage: "url('/images/ruby.svg')" }}
                ></div>
              </div>

              <div className={`${styles.gemItem} ${styles.greenGem}`}>
                <div
                  className={styles.gemIcon}
                  style={{ backgroundImage: "url('/images/emerald.svg')" }}
                ></div>
              </div>

              <div className={`${styles.gemItem} ${styles.pinkGem}`}>
                <div
                  className={styles.gemIcon}
                  style={{ backgroundImage: "url('/images/crystal.svg')" }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.wishlistItems}>
          {wishlistedRewards.length > 0 ? (
            wishlistedRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                rewardName={reward.title}
                price={reward.price ?? 0}
                cover={reward.cover}
                totalBlueGems={totalBlueGems}
                totalGreenGems={totalGreenGems}
                totalPinkGems={totalPinkGems}
                totalRedGems={totalRedGems}
                claimReward={props.claimReward}
                id={reward.id}
                handleIsWishListed={props.handleIsWishListed}
                isWishListed={reward.isWishListed}
                claimedDate={reward.claimedDate}
                currency={reward.currency}
                currentDate={props.today}
              />
            ))
          ) : (
            <div className={styles.wishlistEmpty}>
              <AiOutlineInbox className={styles.emptyIcon} />
              <p className={styles.emptyText}>
                Your wishlist is empty. Add rewards by clicking the heart icon
                on rewards you want to track.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
