"use client";
import { useState } from "react";
import styles from "./AddNewReward.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { FaPlay } from "react-icons/fa";
import { AddNewRewardI } from "@/app/helpers/interfaces";
import CoverModal from "../../coverModal/CoverModal";

export default function AddNewReward(props: AddNewRewardI) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const diamondOptions = [5, 10, 20, 30, 50, 100, 200, 500, 1000];
  const currencyOptions = ["sapphire", "crystal", "emerald", "ruby"];

  return (
    <>
      <div
        className={`${styles.addNewReward} ${!expanded && styles.expanded}`}
        onClick={() => {
          if (!expanded) setExpanded(true);
        }}
      >
        <p className={styles.addNewRewardP}>
          <AiOutlinePlus />{" "}
          {expanded ? (
            <input
              type="text"
              value={String(props.newRewardName)}
              onChange={props.handleInputChange}
              className={styles.addNewRewardInput}
              placeholder="Add a reward"
            />
          ) : (
            "Add a reward"
          )}
        </p>
        {expanded && (
          <div className={styles.expandedContent}>
            <div
              onClick={() => setIsModalOpen(true)}
              className={styles.rewardCardImg}
              style={{
                backgroundImage: `url('/images/rewards/${
                  props.coverName || "reward"
                }.svg')`,
              }}
            ></div>
            <div className={`${styles.rewardPriceDiv} boxShadow`}>
              <div className={styles.rewardPrice}>
                <select
                  className={styles.addNewRewardDropdown}
                  value={props.rewardPrice ?? ""}
                  onChange={(e) => props.handleInputPriceChange(e)}
                >
                  <option value="" disabled>
                    Price:
                  </option>
                  {diamondOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <select
                  className={styles.addNewRewardCurrency}
                  value={props.rewardCurrency || "sapphire"}
                  onChange={(e) => props.handleInputCurrencyChange(e)}
                >
                  {currencyOptions.map((currency) => (
                    <option
                      key={currency}
                      value={currency}
                      className={styles.currencyOption}
                    >
                      {currency.split("-")[0]}
                    </option>
                  ))}
                </select>

                {/* Show the currently selected gem */}
                <div
                  className={styles.selectedGem}
                  style={{
                    backgroundImage: `url('/images/${
                      props.rewardCurrency || "sapphire"
                    }.svg')`,
                    width: "20px",
                    height: "20px",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    marginLeft: "5px",
                  }}
                ></div>
              </div>
              <div
                className={styles.addCancelContainer}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.button}
                  onClick={() => {
                    setExpanded(!expanded);
                    props.setCoverName("reward");
                  }}
                >
                  <AiOutlineClose />
                </button>
                <button
                  className={styles.button}
                  onClick={() => {
                    props.addNewReward();
                    setExpanded(!expanded);
                  }}
                >
                  <FaPlay />
                </button>
              </div>
            </div>
          </div>
        )}
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
