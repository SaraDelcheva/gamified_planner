"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { TodaysHistoryI } from "../helpers/interfaces";
import { cleanTodaysHistory, saveData } from "../helpers/functions";

interface DiamondsContextType {
  totalDiamonds: number;
  setTotalDiamonds: React.Dispatch<React.SetStateAction<number>>;
  todaysHistory: TodaysHistoryI[];
  setTodaysHistory: React.Dispatch<React.SetStateAction<TodaysHistoryI[]>>;
  totalPinkGems: number;
  setTotalPinkGems: React.Dispatch<React.SetStateAction<number>>;
  totalRedGems: number;
  setTotalRedGems: React.Dispatch<React.SetStateAction<number>>;
  totalBlueGems: number;
  setTotalBlueGems: React.Dispatch<React.SetStateAction<number>>;
  totalGreenGems: number;
  setTotalGreenGems: React.Dispatch<React.SetStateAction<number>>;
}

const DiamondsContext = createContext<DiamondsContextType | undefined>(
  undefined
);

export function DiamondsProvider({ children }: { children: React.ReactNode }) {
  const [totalDiamonds, setTotalDiamonds] = useState<number>(0);
  const [totalBlueGems, setTotalBlueGems] = useState<number>(0);
  const [totalRedGems, setTotalRedGems] = useState<number>(0);
  const [totalGreenGems, setTotalGreenGems] = useState<number>(0);
  const [totalPinkGems, setTotalPinkGems] = useState<number>(0);
  const [todaysHistory, setTodaysHistory] = useState<TodaysHistoryI[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();
      setTotalDiamonds(data.totalDiamonds || 0);
      setTotalBlueGems(data.totalBlueGems || 0);
      setTotalRedGems(data.totalRedGems || 0);
      setTotalPinkGems(data.totalPinkGems || 0);
      setTotalGreenGems(data.totalGreenGems || 0);
      console.log("todays history before", todaysHistory);

      const cleanedHistory = cleanTodaysHistory(data.todaysHistory || []);

      console.log("cleanedHistory:", cleanedHistory);
      setTodaysHistory(cleanedHistory);

      // Save cleaned history if needed
      await saveData({ todaysHistory: cleanedHistory });
    }
    fetchData();
  }, []);

  return (
    <DiamondsContext.Provider
      value={{
        totalDiamonds,
        setTotalDiamonds,
        todaysHistory,
        setTodaysHistory,
        totalPinkGems,
        setTotalPinkGems,
        totalRedGems,
        setTotalRedGems,
        totalBlueGems,
        setTotalBlueGems,
        totalGreenGems,
        setTotalGreenGems,
      }}
    >
      {children}
    </DiamondsContext.Provider>
  );
}

export function useDiamonds() {
  const context = useContext(DiamondsContext);
  if (context === undefined) {
    throw new Error("useDiamonds must be used within a DiamondsProvider");
  }
  return context;
}
