export interface StretchMove {
  id: string;
  nameKey: string;
  detailKey: string;
  duration: number; // in seconds
  animationName: string;
  orderIndex: number;
}

export interface StretchSession {
  id: string;
  name: string;
  overview: string;
  stretches: StretchMove[];
  completedAt?: string;
  createdAt: string;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  lastSessionDate?: string;
  completedSessionsCount: number;
  hasSeenOnboarding: boolean;
  totalMinutes: number;
}
