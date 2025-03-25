export interface GoalI {
  title: string;
  diamonds: number;
  coverName: string;
  rewardName: string;
  isCustom: boolean;
  date: string;
}

export interface TodaysHistoryI {
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

  dates: { date: string; isComplete: boolean }[];
}

export interface RewardI {
  title: string;
  diamonds: number | null;
  cover: string;
  id: string;
}

export interface AddGoalI {
  addNewGoal: (containerDate: string) => void;
  setGoalName: (name: string) => void;
  setDifficulty: (diamonds: number) => void;
  difficulty: number | null;
  goalName: string | null;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  customCoverName: string;
  setCustomCoverName: React.Dispatch<React.SetStateAction<string>>;
  setCustomRewardName: React.Dispatch<React.SetStateAction<string>>;
  setIsCustom: React.Dispatch<React.SetStateAction<boolean>>;
  isCustom: boolean;
  cancelAddGoal: () => void;
  setIsCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  containerDate: string;
  isCalendarOpen: boolean;
  goalDate: string;
}

export interface GoalsForTodayI extends AddGoalI {
  title: string;
  completeGoal: (goalTitle: string) => void;
  goals: GoalI[];
  totalDiamonds: number;
  customRewardName: string;
  setGoalDate: React.Dispatch<React.SetStateAction<string>>;
  onClickDay: (value: Date) => void;
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
}
