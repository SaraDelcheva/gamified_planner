import { GoalI, TodaysHistoryI, RewardI, NoteI } from "./interfaces";

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
    notes: NoteI[];
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

// --------------------------------------------------------------------Create Dates

export function createDates(
  startIndex: number,
  count: number,
  direction: "forward" | "backward" = "forward"
) {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();

    // Depending on the direction, move forward or backward
    if (direction === "backward") {
      date.setDate(date.getDate() - (startIndex + i)); // Go backwards
    } else {
      date.setDate(date.getDate() + (startIndex + i)); // Go forwards
    }

    const formattedDate = formatDate(date);
    const day = date.toLocaleDateString("en-US", { weekday: "long" });
    return { formattedDate, day };
  });
}

// --------------------------------------------------------------------Update Todays History Dates
export function cleanTodaysHistory(
  todaysHistory: TodaysHistoryI[]
): TodaysHistoryI[] {
  if (!Array.isArray(todaysHistory)) return [];

  const today = formatDate(new Date());

  const filtered = todaysHistory.filter((item) => item.date === today);

  return filtered;
}
