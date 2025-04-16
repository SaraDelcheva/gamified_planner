export interface GoalI {
  title: string;
  diamonds: number;
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
  diamonds: number | null;
  isWishListed: boolean;
  cover: string;
  id: string;
}

export interface AddGoalI {
  goalName: string | null;
  difficulty: number | null;
  isCustom: boolean;
  customCoverName: string;
  newGoalDate: string;
  goalDate: string;

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
  InputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  DiamondChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  addNewReward: () => void;
  claimReward: (e: React.MouseEvent<HTMLButtonElement>) => void;
  coverName: string;
  setCoverName: React.Dispatch<React.SetStateAction<string>>;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  handleIsWishListed: (e: React.MouseEvent<HTMLDivElement>) => void;
}
export interface AddNewRewardI {
  addNewReward: () => void;
  diamonds: number | null;
  newRewardName: string | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputDiamondChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  coverName: string;
  setCoverName: React.Dispatch<React.SetStateAction<string>>;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export interface RewardCardI {
  rewardName: string;
  diamonds: number;
  cover: string;
  totalDiamonds: number;
  claimReward: (e: React.MouseEvent<HTMLButtonElement>) => void;
  id: string;
  handleIsWishListed: (e: React.MouseEvent<HTMLDivElement>) => void;
  isWishListed: boolean;
}

export interface SaveDataFunctionI {
  (
    updatedData: Partial<{
      totalDiamonds: number;
      rewards: RewardI[];
      goals: GoalI[];
      todaysHistory: TodaysHistoryI[];
    }>
  ): Promise<void>;
}
