export interface GoalI {
  title: string;
  diamonds: number;
  coverName: string;
  rewardName: string;
  isCustom: boolean;
}

export interface RewardI {
  title: string;
  diamonds: number | null;
  cover: string;
  id: string;
}

export interface AddGoalI {
  addNewGoal: () => void;
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
}

export interface GoalsForTodayI extends AddGoalI {
  completeGoal: (goalTitle: string) => void;
  goals: GoalI[];
  totalDiamonds: number;
  customRewardName: string;
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
