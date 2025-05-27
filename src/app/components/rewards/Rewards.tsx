"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./Rewards.module.css";
import AddNewReward from "./addNewReward/AddNewReward";
import ShopItem from "./shopItem/ShopItem";
import { RewardsI } from "@/app/helpers/interfaces";
import { useDiamonds } from "@/app/context/DiamondsContext";
import {
  FaShoppingBag,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
} from "react-icons/fa";
import { GiBlacksmith } from "react-icons/gi";

interface GemTotals {
  blue: number;
  pink: number;
  red: number;
  green: number;
}

export default function Rewards(props: Omit<RewardsI, "totalDiamonds">) {
  const [currentShop, setCurrentShop] = useState<string>("sapphire");
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const { totalBlueGems, totalRedGems, totalGreenGems, totalPinkGems } =
    useDiamonds();
  const rewardsRef = useRef<HTMLDivElement>(null);
  const shopBtnRef = useRef<HTMLDivElement>(null);

  // Calculate items per page based on screen size
  useEffect(() => {
    const calculateItemsPerPage = () => {
      const isMobile = window.innerWidth <= 767;
      const isTablet = window.innerWidth <= 1024;

      if (isMobile) {
        setItemsPerPage(4); // 2x2 grid on mobile
      } else if (isTablet) {
        setItemsPerPage(6); // 2x3 grid on tablet
      } else {
        setItemsPerPage(8); // 2x4 grid on desktop
      }
    };

    calculateItemsPerPage();
    window.addEventListener("resize", calculateItemsPerPage);
    return () => window.removeEventListener("resize", calculateItemsPerPage);
  }, []);

  // Reset to first page when changing shops
  useEffect(() => {
    setCurrentPage(0);
  }, [currentShop]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        rewardsRef.current &&
        !rewardsRef.current.contains(event.target as Node) &&
        shopBtnRef.current &&
        !shopBtnRef.current.contains(event.target as Node) &&
        isShopOpen
      ) {
        setIsShopOpen(false);
      }
    }

    if (isShopOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShopOpen]);

  const handleItemSelect = (itemId: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const getSelectedItemsTotal = () => {
    return selectedItems.reduce<GemTotals>(
      (total, itemId) => {
        const item = props.rewards.find((r) => r.id === itemId);
        if (!item || item.price === null) return total;

        switch (item.currency) {
          case "sapphire":
            return { ...total, blue: total.blue + item.price };
          case "crystal":
            return { ...total, pink: total.pink + item.price };
          case "ruby":
            return { ...total, red: total.red + item.price };
          case "emerald":
            return { ...total, green: total.green + item.price };
          default:
            return total;
        }
      },
      { blue: 0, pink: 0, red: 0, green: 0 }
    );
  };

  // Calculate remaining gems after temporary deduction
  const getRemainingGems = () => {
    const selectedTotals = getSelectedItemsTotal();
    return {
      blue: totalBlueGems - selectedTotals.blue,
      pink: totalPinkGems - selectedTotals.pink,
      red: totalRedGems - selectedTotals.red,
      green: totalGreenGems - selectedTotals.green,
    };
  };

  const canAffordSelected = () => {
    const totals = getSelectedItemsTotal();
    return (
      totals.blue <= totalBlueGems &&
      totals.pink <= totalPinkGems &&
      totals.red <= totalRedGems &&
      totals.green <= totalGreenGems
    );
  };

  const handleBuySelected = () => {
    if (!canAffordSelected()) return;

    selectedItems.forEach((itemId) => {
      const item = props.rewards.find((r) => r.id === itemId);
      if (item) {
        const reward = {
          id: item.id,
          title: item.title,
          price: item.price,
          currency: item.currency,
          isWishListed: item.isWishListed,
          cover: item.cover || "",
        };
        props.claimReward(reward);
      }
    });

    setSelectedItems([]);
  };

  const filteredRewards = props.rewards.filter(
    (reward) => reward.currency === currentShop
  );

  const totalPages = Math.ceil(filteredRewards.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentPageItems = filteredRewards.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const remainingGems = getRemainingGems();
  const gemCounts = [
    {
      type: "sapphire",
      amount: remainingGems.blue,
      originalAmount: totalBlueGems,
      image: "/images/sapphire.svg",
    },
    {
      type: "crystal",
      amount: remainingGems.pink,
      originalAmount: totalPinkGems,
      image: "/images/crystal.svg",
    },
    {
      type: "ruby",
      amount: remainingGems.red,
      originalAmount: totalRedGems,
      image: "/images/ruby.svg",
    },
    {
      type: "emerald",
      amount: remainingGems.green,
      originalAmount: totalGreenGems,
      image: "/images/emerald.svg",
    },
  ];

  const purchaseTotals = getSelectedItemsTotal();
  const hasSelectedItems = selectedItems.length > 0;
  const isAffordable = canAffordSelected();

  const renderPurchaseCosts = () => {
    const costs = [];
    if (purchaseTotals.blue > 0) {
      costs.push(
        <div
          key="blue"
          className={`${styles.purchaseCost} ${
            purchaseTotals.blue <= totalBlueGems ? styles.affordable : ""
          }`}
        >
          <div
            className={styles.gemIcon}
            style={{ backgroundImage: "url('/images/sapphire.svg')" }}
          />
          <span>{purchaseTotals.blue}</span>
        </div>
      );
    }
    if (purchaseTotals.pink > 0) {
      costs.push(
        <div
          key="pink"
          className={`${styles.purchaseCost} ${
            purchaseTotals.pink <= totalPinkGems ? styles.affordable : ""
          }`}
        >
          <div
            className={styles.gemIcon}
            style={{ backgroundImage: "url('/images/crystal.svg')" }}
          />
          <span>{purchaseTotals.pink}</span>
        </div>
      );
    }
    if (purchaseTotals.red > 0) {
      costs.push(
        <div
          key="red"
          className={`${styles.purchaseCost} ${
            purchaseTotals.red <= totalRedGems ? styles.affordable : ""
          }`}
        >
          <div
            className={styles.gemIcon}
            style={{ backgroundImage: "url('/images/ruby.svg')" }}
          />
          <span>{purchaseTotals.red}</span>
        </div>
      );
    }
    if (purchaseTotals.green > 0) {
      costs.push(
        <div
          key="green"
          className={`${styles.purchaseCost} ${
            purchaseTotals.green <= totalGreenGems ? styles.affordable : ""
          }`}
        >
          <div
            className={styles.gemIcon}
            style={{ backgroundImage: "url('/images/emerald.svg')" }}
          />
          <span>{purchaseTotals.green}</span>
        </div>
      );
    }
    return costs;
  };

  return (
    <>
      <div
        ref={shopBtnRef}
        className={styles.shopBtn}
        onClick={() => {
          setIsShopOpen(!isShopOpen);
        }}
      >
        <FaShoppingBag className={styles.shopIcon} />
      </div>

      <div
        ref={rewardsRef}
        className={`${styles.rewards} ${isShopOpen ? styles.open : ""}`}
      >
        <div
          className={styles.coverContainer}
          style={{ backgroundImage: `url('/images/${currentShop}Shop.jpg')` }}
        >
          <div className={styles.header}>
            {currentShop === "craft"
              ? "CRAFTING STATION"
              : `${currentShop.toUpperCase()} REWARD SHOP`}
          </div>
          <div className={styles.marketplaceBtns}>
            <button
              className={`${styles.marketplaceBtn} ${
                currentShop === "sapphire" ? styles.active : ""
              }`}
              onClick={() => setCurrentShop("sapphire")}
              title="Sapphire Shop"
            >
              <div
                className={styles.gemIcon}
                style={{ backgroundImage: "url('/images/sapphire.svg')" }}
              />
            </button>
            <button
              className={`${styles.marketplaceBtn} ${
                currentShop === "ruby" ? styles.active : ""
              }`}
              onClick={() => setCurrentShop("ruby")}
              title="Ruby Shop"
            >
              <div
                className={styles.gemIcon}
                style={{ backgroundImage: "url('/images/ruby.svg')" }}
              />
            </button>
            <button
              className={`${styles.marketplaceBtn} ${
                currentShop === "crystal" ? styles.active : ""
              }`}
              onClick={() => setCurrentShop("crystal")}
              title="Crystal Shop"
            >
              <div
                className={styles.gemIcon}
                style={{ backgroundImage: "url('/images/crystal.svg')" }}
              />
            </button>
            <button
              className={`${styles.marketplaceBtn} ${
                currentShop === "emerald" ? styles.active : ""
              }`}
              onClick={() => setCurrentShop("emerald")}
              title="Emerald Shop"
            >
              <div
                className={styles.gemIcon}
                style={{ backgroundImage: "url('/images/emerald.svg')" }}
              />
            </button>
            <button
              className={`${styles.marketplaceBtn} ${
                currentShop === "craft" ? styles.active : ""
              }`}
              onClick={() => setCurrentShop("craft")}
              title="Crafting Station"
            >
              <GiBlacksmith className={styles.gemIcon} />
            </button>
          </div>
        </div>

        <div className={styles.rewardsContainer}>
          {currentShop === "craft" ? (
            <AddNewReward
              rewardPrice={props.rewardPrice}
              rewardCurrency={props.rewardCurrency}
              handleInputCurrencyChange={props.currencyChange}
              newRewardName={props.rewardName}
              addNewReward={props.addNewReward}
              handleInputChange={props.InputChange}
              handleInputPriceChange={props.PriceChange}
              setCoverName={props.setCoverName}
              coverName={props.coverName}
              isModalOpen={props.isModalOpen}
              setIsModalOpen={props.setIsModalOpen}
            />
          ) : (
            <>
              <div className={styles.rewardsGrid}>
                {currentPageItems.map((reward) => (
                  <ShopItem
                    key={reward.id}
                    id={reward.id}
                    rewardName={reward.title}
                    price={reward.price ?? 0}
                    currency={reward.currency}
                    cover={reward.cover}
                    isSelected={selectedItems.includes(reward.id)}
                    onSelect={handleItemSelect}
                    totalBlueGems={remainingGems.blue}
                    totalPinkGems={remainingGems.pink}
                    totalRedGems={remainingGems.red}
                    totalGreenGems={remainingGems.green}
                    claimReward={props.claimReward}
                    handleIsWishListed={props.handleIsWishListed}
                    isWishListed={reward.isWishListed}
                    claimedDate={reward.claimedDate}
                    currentDate={props.currentDate}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.paginationBtn}
                    onClick={goToPrevPage}
                    disabled={currentPage === 0}
                  >
                    <FaChevronLeft />
                  </button>
                  <span className={styles.pageInfo}>
                    {currentPage + 1} / {totalPages}
                  </span>
                  <button
                    className={styles.paginationBtn}
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages - 1}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Enhanced gem wallet and purchase summary */}
          <div className={styles.gemSummary}>
            {/* Player's Wallet Section */}
            <div className={styles.walletSection}>
              <div className={styles.walletTitle}>Your Gem Wallet</div>
              <div className={styles.gemWallet}>
                {gemCounts.map((gem) => (
                  <div key={gem.type} className={styles.gemCount}>
                    <div
                      className={styles.gemIcon}
                      style={{ backgroundImage: `url('${gem.image}')` }}
                    />
                    <span
                      className={
                        gem.amount !== gem.originalAmount
                          ? styles.temporaryDeduction
                          : ""
                      }
                    >
                      {gem.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase Summary Section */}
            {currentShop !== "craft" && (
              <div className={styles.purchaseSection}>
                <div className={styles.purchaseSummary}>
                  <div className={styles.purchaseTitle}>
                    {hasSelectedItems
                      ? `Purchase Cost (${selectedItems.length} items)`
                      : "Select items to purchase"}
                  </div>
                  <div className={styles.purchaseCosts}>
                    {hasSelectedItems ? (
                      renderPurchaseCosts().length > 0 ? (
                        renderPurchaseCosts()
                      ) : (
                        <div className={styles.emptyPurchase}>
                          Free items selected
                        </div>
                      )
                    ) : (
                      <div className={styles.emptyPurchase}>
                        No items selected
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  {hasSelectedItems && (
                    <button
                      className={styles.clearButton}
                      onClick={clearSelection}
                      title="Clear selection"
                    >
                      <FaTrash />
                    </button>
                  )}

                  <button
                    className={styles.buySelectedButton}
                    disabled={!hasSelectedItems || !isAffordable}
                    onClick={handleBuySelected}
                    title={
                      !hasSelectedItems
                        ? "Select items to purchase"
                        : !isAffordable
                        ? "Insufficient gems"
                        : `Purchase ${selectedItems.length} items`
                    }
                  >
                    {!hasSelectedItems
                      ? "Select Items"
                      : !isAffordable
                      ? "Can't Afford"
                      : `Buy Selected (${selectedItems.length})`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
