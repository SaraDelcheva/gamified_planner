import { GoalI, TodaysHistoryI, RewardI } from "./interfaces";

// --------------------------------------------------------------------Format Date
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

// -------------------------------------------------------------------- Save all updated data at once
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

// --------------------------------------------------------------------Toggle set is calendar open
export function toggleCalendar(
  setIsCalendarOpen: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >,
  date: string
) {
  setIsCalendarOpen((prev) => {
    const newCalendar = { [date]: !prev[date] };
    Object.keys(prev).forEach((key) => {
      if (key !== date) {
        newCalendar[key] = false;
      }
    });
    return newCalendar;
  });
}

// --------------------------------------------------------------------Claim Reward
export function claimReward({
  e,
  rewards,
  totalDiamonds,
  todaysHistory,
  setTodaysHistory,
  setRewards,
  setTotalDiamonds,
}: {
  e: React.MouseEvent<HTMLButtonElement>;
  rewards: RewardI[];
  totalDiamonds: number;
  todaysHistory: TodaysHistoryI[];
  setTodaysHistory: React.Dispatch<React.SetStateAction<TodaysHistoryI[]>>;
  setRewards: React.Dispatch<React.SetStateAction<RewardI[]>>;
  setTotalDiamonds: React.Dispatch<React.SetStateAction<number>>;
}) {
  const claimableRewards = rewards.filter(
    (reward) => reward.diamonds && reward.diamonds <= totalDiamonds
  );
  if (!claimableRewards.length) return;

  const button = e.target as HTMLButtonElement;
  const claimedReward = rewards.filter(
    (reward) => reward.id === button.parentElement?.parentElement?.id
  );
  const updatedRewards = rewards.filter(
    (reward) => reward.id !== claimedReward[0].id
  );
  const newTotalDiamonds = totalDiamonds - claimedReward[0].diamonds!;

  const newHistory = [
    ...todaysHistory,
    {
      type: "reward",
      title: claimedReward[0].title,
      cover: claimedReward[0].cover,
    },
  ];

  setTodaysHistory(newHistory);
  setRewards(updatedRewards);
  setTotalDiamonds(newTotalDiamonds);

  saveData({
    rewards: updatedRewards,
    totalDiamonds: newTotalDiamonds,
    todaysHistory: newHistory,
  });
}

// --------------------------------------------------------------------Create Dates
export function createDates(x: number) {
  return Array.from({ length: x }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const formattedDate = formatDate(date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    return { formattedDate, dayName };
  });
}
