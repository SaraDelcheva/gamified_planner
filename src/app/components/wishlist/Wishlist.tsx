import styles from "./Wishlist.module.css";
import { RewardI } from "@/app/helpers/interfaces";
import RewardCard from "../rewards/rewardCard/RewardCard";
// import { IoDiamondOutline } from "react-icons/io5";
import { useDiamonds } from "@/app/context/DiamondsContext";

interface WishlistProps {
  rewards: RewardI[];
  claimReward: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleIsWishListed: (e: React.MouseEvent<HTMLDivElement>) => void;
  today: string;
}

export default function Wishlist(props: WishlistProps) {
  const { totalBlueGems, totalRedGems, totalGreenGems, totalPinkGems } =
    useDiamonds();
  const wishlistedRewards = props.rewards.filter(
    (reward) => reward.isWishListed
  );

  // const totalWishListPrice = wishlistedRewards.reduce(
  //   (total, reward) => total + (reward.diamonds ?? 0),
  //   0
  // );
  return (
    <div className={styles.wishlist}>
      <div className={styles.wishlistTitle}>WISHLIST</div>
      <div className={`${styles.wishlistItems} wishlistItems`}>
        {wishlistedRewards.map((reward) => (
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
        ))}
      </div>
      {/* <div className={styles.wishlistInfo}>
        You need{" "}
        <span className={styles.wishlistInfoSpan}>
          {totalWishListPrice} <IoDiamondOutline />
        </span>{" "}
        to claim all your wishlisted rewards.
      </div> */}
    </div>
  );
}
