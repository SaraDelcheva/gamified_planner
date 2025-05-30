"use client";
import { useState } from "react";
import styles from "./AddNewReward.module.css";
import { FaTrash } from "react-icons/fa";
import { GiBlacksmith } from "react-icons/gi";
import { AddNewRewardI } from "@/app/helpers/interfaces";
import CoverModal from "../../coverModal/CoverModal";
import React from "react";

export default function AddNewReward(props: AddNewRewardI) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const diamondOptions = [5, 10, 20, 30, 50, 100, 200, 500, 1000];
  const currencyOptions = ["sapphire", "crystal", "emerald", "ruby"];
  const [warningMessage, setWarningMessage] = useState<string>("");

  const handleCraftClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(true);
  };

  const handleGoBackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(false);
    setWarningMessage("");
  };

  const handleConfirmCraft = (e: React.MouseEvent) => {
    e.stopPropagation();
    let message = "";
    if (!props.newRewardName && props.rewardPrice === null) {
      message = "both";
    } else if (!props.newRewardName) {
      message = "name";
    } else if (props.rewardPrice === null) {
      message = "price";
    }
    setWarningMessage(message);

    if (message) {
      return;
    }
    props.addNewReward();
    setExpanded(false);
  };

  const isFormValid = props.newRewardName && props.rewardPrice !== null;

  return (
    <>
      <div className={styles.addNewReward}>
        <div
          className={styles.shopItem}
          onClick={(e) => !expanded && handleCraftClick(e)}
        >
          <div className={styles.rewardInfo}>
            {expanded ? (
              <>
                {/* Reward Image/Cover Selection */}
                <div
                  className={styles.rewardImage}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                  style={{
                    backgroundImage: `url('/images/rewards/${
                      props.coverName || "reward"
                    }.svg')`,
                  }}
                />
                <input
                  type="text"
                  value={String(props.newRewardName)}
                  onChange={props.handleInputChange}
                  className={styles.rewardName}
                  placeholder="Add a reward title"
                  onClick={(e) => e.stopPropagation()}
                />
              </>
            ) : (
              <div className={styles.rewardName}>
                <GiBlacksmith style={{ fontSize: "1.5em", marginRight: 8 }} />{" "}
                Craft New Reward
              </div>
            )}
            {expanded && (
              <div className={styles.priceAndActions}>
                <div className={styles.priceContainer}>
                  <div className={styles.customSelect}>
                    <select
                      value={props.rewardPrice ?? ""}
                      onChange={props.handleInputPriceChange}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="" disabled>
                        Price
                      </option>
                      {diamondOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.customSelect}>
                    <select
                      value={props.rewardCurrency || "sapphire"}
                      onChange={props.handleInputCurrencyChange}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {currencyOptions.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    className={styles.gemIcon}
                    style={{
                      backgroundImage: `url('/images/${
                        props.rewardCurrency || "sapphire"
                      }.svg')`,
                      width: "16px",
                      height: "16px",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                </div>
                <div className={styles.actions}>
                  <button
                    className={`${styles.actionButton} ${styles.cancel}`}
                    onClick={handleGoBackClick}
                  >
                    <FaTrash style={{ fontSize: "1.5em" }} />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.confirm} ${
                      !isFormValid ? styles["is-disabled"] : ""
                    }`}
                    onClick={handleConfirmCraft}
                    onMouseEnter={() => {
                      if (!isFormValid) {
                        let message = "";
                        if (
                          !props.newRewardName &&
                          props.rewardPrice === null
                        ) {
                          message = "both";
                        } else if (!props.newRewardName) {
                          message = "name";
                        } else if (props.rewardPrice === null) {
                          message = "price";
                        }
                        setWarningMessage(message);
                      }
                    }}
                    onMouseLeave={() => {
                      setWarningMessage("");
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <GiBlacksmith style={{ fontSize: "2em" }} />
                    </span>
                  </button>
                </div>
                {warningMessage && (
                  <p className={styles.warningMessage}>
                    {
                      {
                        name: "Please enter a title.",
                        price: "Please select a price.",
                        both: "Please enter a title and select a price.",
                      }[warningMessage]
                    }
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <CoverModal
          coverName={props.coverName}
          setCoverName={props.setCoverName}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </>
  );
}
