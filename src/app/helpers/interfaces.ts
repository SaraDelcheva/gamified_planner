export interface SubtaskI {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface GoalI {
  title: string;
  price: number;
  coverName: string;
  rewardName: string;
  isCustom: boolean;
  currency: string;
  date: string;
  repeating: string;
  isCompleted: boolean;
  priority: string;
  subtasks?: SubtaskI[];
}

export interface NoteI {
  title?: string;
  content?: string;
  reminder?: string;
  id: string;
  type: "text" | "checklist";
}

export interface TodaysHistoryI {
  date: string;
  type: string;
  title: string;
  cover?: string;
}

export interface Streak {
  start: string;
  end: string;
  length: number;
}

export interface HabitI {
  title: string;
  latestStreak: number;
  maxStreak: number;
  dates: string[];
}

export interface RewardI {
  id: string;
  title: string;
  price: number | null;
  currency: string;
  isWishListed: boolean;
  cover: string;
  claimedDate?: string;
}

export interface AddGoalI {
  goalName: string | null;
  difficulty: number;
  isCustom: boolean;
  customCoverName: string;
  newGoalDate: string;
  goalDate: string;
  currency: string;
  repeating: string;
  priority: string;

  addNewGoal: (containerDate: string) => void;
  cancelAddGoal: () => void;
  setRepeating: React.Dispatch<React.SetStateAction<string>>;

  setGoalName: (name: string) => void;
  setDifficulty: (diamonds: number) => void;
  setIsCustom: React.Dispatch<React.SetStateAction<boolean>>;
  setCustomCoverName: React.Dispatch<React.SetStateAction<string>>;
  setCustomRewardName: React.Dispatch<React.SetStateAction<string>>;
  setExpanded: (expanded: boolean) => void;
  setIsCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;

  expanded: boolean;
  isCalendarOpen: boolean;

  onClickDay: (value: Date) => void;
  isEditing: boolean;
  editingGoalId: string | null;
  rewardCurrency: string;

  handleInputChange: (
    type: "currency" | "priority" | "difficulty" | "repeat",
    value: string
  ) => void;
  addSubtask?: (goalTitle: string, subtaskTitle: string) => void;
  deleteSubtask?: (goalTitle: string, subtaskId: string) => void;
  goals: GoalI[];
  currentSubtasks: SubtaskI[];
  addCurrentSubtask: (subtaskTitle: string) => void;
  toggleCurrentSubtaskCompletion: (subtaskId: string) => void;
  deleteCurrentSubtask: (subtaskId: string) => void;
}

export interface GoalsForTodayI extends AddGoalI {
  title: string;
  completeGoal: (goalTitle: string) => void;
  deleteGoal: (goalTitle: string) => void;
  editGoal: (goalTitle: string) => void;
  totalDiamonds: number;
  customRewardName: string;
  setGoalDate: React.Dispatch<React.SetStateAction<string>>;
  notes: NoteI[];
  removeReminder: (noteId: string) => void;
  toggleSubtaskCompletion: (goalTitle: string, subtaskId: string) => void;
  deleteSubtask: (goalTitle: string, subtaskId: string) => void;
}

export interface RewardsI {
  rewards: RewardI[];
  claimReward: (reward: RewardI) => void;
  handleIsWishListed: (e: React.MouseEvent<HTMLDivElement>) => void;
  currentDate: string;
  totalDiamonds: number;
  rewardName: string;
  rewardPrice: number | null;
  rewardCurrency: string;
  InputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  PriceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  currencyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  addNewReward: () => void;
  coverName: string;
  setCoverName: React.Dispatch<React.SetStateAction<string>>;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  totalBlueGems: number;
  totalRedGems: number;
  totalGreenGems: number;
  totalPinkGems: number;
}

export interface AddNewRewardI {
  addNewReward: () => void;
  rewardPrice: number | null;
  rewardCurrency: string;
  newRewardName: string | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputPriceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleInputCurrencyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  coverName: string;
  setCoverName: React.Dispatch<React.SetStateAction<string>>;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export interface RewardCardI {
  id: string;
  rewardName: string;
  price: number | null;
  currency: string;
  cover?: string;
  totalBlueGems: number;
  totalPinkGems: number;
  totalRedGems: number;
  totalGreenGems: number;
  claimReward: (reward: RewardI) => void;
  handleIsWishListed: (e: React.MouseEvent<HTMLDivElement>) => void;
  isWishListed: boolean;
  claimedDate?: string;
  currentDate: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export interface SaveDataFunctionI {
  (
    updatedData: Partial<{
      totalBlueGems?: number;
      totalRedGems?: number;
      totalGreenGems?: number;
      totalPinkGems?: number;
      rewards: RewardI[];
      goals: GoalI[];
      todaysHistory: TodaysHistoryI[];
      goalNumber: number;
      completedGoalNumber: number;
      notCompletedGoalNumber: number;
    }>
  ): Promise<void>;
}
