import styles from "./Wishlist.module.css";
import { RewardI } from "@/app/helpers/interfaces";
import RewardCard from "../rewards/rewardCard/RewardCard";
import { IoDiamondOutline } from "react-icons/io5";

interface WishlistProps {
  rewards: RewardI[];
  claimReward: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleIsWishListed: (e: React.MouseEvent<HTMLDivElement>) => void;
  totalDiamonds: number;
}

export default function Wishlist({
  rewards,
  claimReward,
  handleIsWishListed,
  totalDiamonds,
}: WishlistProps) {
  const wishlistedRewards = rewards.filter((reward) => reward.isWishListed);
  const totalWishListPrice = wishlistedRewards.reduce(
    (total, reward) => total + (reward.diamonds ?? 0),
    0
  );
  return (
    <div className={styles.wishlist}>
      <div className="header">Wishlist</div>
      {wishlistedRewards.map((reward) => (
        <div key={reward.id} className={styles.wishlistItem}>
          <RewardCard
            key={reward.id}
            rewardName={reward.title}
            diamonds={reward.diamonds ?? 0}
            cover={reward.cover}
            totalDiamonds={totalDiamonds}
            claimReward={claimReward}
            id={reward.id}
            handleIsWishListed={handleIsWishListed}
            isWishListed={reward.isWishListed}
          />
        </div>
      ))}
      <div className={styles.wishlistInfo}>
        You need{" "}
        <span className={styles.wishlistInfoSpan}>
          {totalWishListPrice} <IoDiamondOutline />
        </span>{" "}
        to claim all your wishlisted rewards.
      </div>
    </div>
  );
}
