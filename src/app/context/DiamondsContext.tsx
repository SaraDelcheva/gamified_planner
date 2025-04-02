"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface DiamondsContextType {
  totalDiamonds: number;
  setTotalDiamonds: React.Dispatch<React.SetStateAction<number>>;
}

const DiamondsContext = createContext<DiamondsContextType | undefined>(
  undefined
);

export function DiamondsProvider({ children }: { children: React.ReactNode }) {
  const [totalDiamonds, setTotalDiamonds] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();
      setTotalDiamonds(data.totalDiamonds || 0);
    }
    fetchData();
  }, []);

  return (
    <DiamondsContext.Provider value={{ totalDiamonds, setTotalDiamonds }}>
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
