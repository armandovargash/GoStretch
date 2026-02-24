import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStats } from '../types';

interface AppState {
    // User Stats
    stats: UserStats;
    completeOnboarding: () => void;
    incrementStreak: () => void;
    resetStreak: () => void;

    // App Theme/Settings (Global toggles if needed, adhering to HIG)
    isHapticEnabled: boolean;
    toggleHaptics: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            stats: {
                currentStreak: 0,
                longestStreak: 0,
                completedSessionsCount: 0,
                hasSeenOnboarding: false,
            },
            isHapticEnabled: true,

            completeOnboarding: () =>
                set((state) => ({
                    stats: { ...state.stats, hasSeenOnboarding: true }
                })),

            incrementStreak: () => {
                const now = new Date();
                const lastSessionStr = get().stats.lastSessionDate;

                let newCurrentStreak = get().stats.currentStreak;
                let newLongestStreak = get().stats.longestStreak;

                if (lastSessionStr) {
                    const lastSessionDate = new Date(lastSessionStr);
                    const diffTime = Math.abs(now.getTime() - lastSessionDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        newCurrentStreak += 1;
                    } else if (diffDays > 1) {
                        newCurrentStreak = 1; // Streak broken
                    }
                } else {
                    // First time completing a session
                    newCurrentStreak = 1;
                }

                if (newCurrentStreak > newLongestStreak) {
                    newLongestStreak = newCurrentStreak;
                }

                set((state) => ({
                    stats: {
                        ...state.stats,
                        currentStreak: newCurrentStreak,
                        longestStreak: newLongestStreak,
                        completedSessionsCount: state.stats.completedSessionsCount + 1,
                        lastSessionDate: now.toISOString(),
                    }
                }));
            },

            resetStreak: () => set((state) => ({ stats: { ...state.stats, currentStreak: 0 } })),

            toggleHaptics: () => set((state) => ({ isHapticEnabled: !state.isHapticEnabled })),
        }),
        {
            name: 'gostretch-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
