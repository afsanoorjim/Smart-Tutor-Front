export type Student = {
  id: string;
  name: string;
  className: string;
  masteryPercent: number; // 0-100
  lastActive: string; // ISO date
  status: "on-track" | "attention" | "at-risk";
  topicsMastered: number;
  topicsTotal: number;
};

export type ClassGroup = {
  id: string;
  name: string;
  studentCount: number;
  averageMastery: number;
};

export type ProgressPoint = {
  date: string; // ISO date
  score: number; // 0-100
};

export type StudentDetail = Student & {
  history: ProgressPoint[];
  topics: { name: string; mastery: number }[];
};
