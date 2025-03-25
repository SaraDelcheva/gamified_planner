import { GoalI, TodaysHistoryI, RewardI } from "./interfaces";

//format date
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

// Save all updated data at once
export async function saveData(
  updatedData: Partial<{
    totalDiamonds: number;
    rewards: RewardI[];
    goals: GoalI[];
    todaysHistory: TodaysHistoryI[];
  }>
) {
  const res = await fetch("/api/data");
  const data = await res.json();

  const newData = { ...data, ...updatedData };

  await fetch("/api/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: newData }),
  });
}
