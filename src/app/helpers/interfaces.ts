export interface GoalI {
  title: string;
  price: number;
  currency: string;
  coverName: string;
  rewardName: string;
  isCustom: boolean;
  date: string;
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
  title: string;
  price: number | null;
  currency: string;
  isWishListed: boolean;
  cover: string;
  id: string;
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

  addNewGoal: (containerDate: string) => void;
  cancelAddGoal: () => void;

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
  handleInputCurrencyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface GoalsForTodayI extends AddGoalI {
  title: string;
  goals: GoalI[];
  completeGoal: (goalTitle: string) => void;
  deleteGoal: (goalTitle: string) => void;
  editGoal: (goalTitle: string) => void;
  totalDiamonds: number;
  customRewardName: string;
  setGoalDate: React.Dispatch<React.SetStateAction<string>>;
  notes: NoteI[];
}

export interface RewardsI {
  totalDiamonds: number;
  rewards: RewardI[];
  rewardName: string;
  rewardPrice: number | null;
  rewardCurrency: string;
  InputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  PriceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  currencyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  addNewReward: () => void;
  claimReward: (e: React.MouseEvent<HTMLButtonElement>) => void;
  coverName: string;
  setCoverName: React.Dispatch<React.SetStateAction<string>>;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  handleIsWishListed: (e: React.MouseEvent<HTMLDivElement>) => void;
  currentDate: string;
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
  rewardName: string;
  price: number;
  currency: string;
  cover: string;
  totalBlueGems: number;
  totalRedGems: number;
  totalGreenGems: number;
  totalPinkGems: number;
  claimReward: (e: React.MouseEvent<HTMLButtonElement>) => void;
  id: string;
  handleIsWishListed: (e: React.MouseEvent<HTMLDivElement>) => void;
  isWishListed: boolean;
  claimedDate?: string;
  currentDate: string;
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
    }>
  ): Promise<void>;
}
