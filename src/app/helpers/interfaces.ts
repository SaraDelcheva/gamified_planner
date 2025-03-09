export interface GoalI {
  title: string;
  diamonds: number;
}

export interface RewardI {
  title: string;
  diamonds: number | null;
  cover: string;
}

export interface AddGoalI {
  addNewGoal: () => void;
  setDifficulty: (diamonds: number) => void;
  setGoalName: (name: string) => void;
  difficulty: number | null;
  goalName: string | null;
  expanded: boolean;
  setExpanded: (value: boolean) => void;
}

export interface GoalsForTodayI {
  goals: GoalI[];
  totalDiamonds: number;
  addNewGoal: () => void;
  setDifficulty: (difficulty: number | null) => void;
  difficulty: number | null;
  goalName: string;
  setGoalName: (name: string) => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  completeGoal: (goalTitle: string) => void;
}

export interface RewardsI {
  totalDiamonds: number;
  rewards: RewardI[];
  rewardName: string;
  rewardPrice: number | null;
  InputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  DiamondChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  addNewReward: () => void;
  claimReward: (e:React.MouseEvent<HTMLButtonElement>) => void;
  coverName: string
  setCoverName: React.Dispatch<React.SetStateAction<string>>;
}
export interface AddNewRewardI {
  addNewReward: () => void;
  diamonds: number | null;
  newRewardName: string | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputDiamondChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  coverName: string
  setCoverName: React.Dispatch<React.SetStateAction<string>>;
} 