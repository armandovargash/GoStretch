import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../useAppStore';

describe('Global Store (useAppStore)', () => {
    beforeEach(() => {
        useAppStore.setState({
            stats: {
                currentStreak: 0,
                longestStreak: 0,
                completedSessionsCount: 0,
                hasSeenOnboarding: false,
                totalMinutes: 0,
            },
            isHapticEnabled: true,
        });
    });

    it('should initialize with default states', () => {
        const state = useAppStore.getState();
        expect(state.stats.hasSeenOnboarding).toBe(false);
        expect(state.stats.currentStreak).toBe(0);
        expect(state.stats.completedSessionsCount).toBe(0);
        expect(state.stats.totalMinutes).toBe(0);
        expect(state.isHapticEnabled).toBe(true);
    });

    it('should complete onboarding correctly', () => {
        const { completeOnboarding } = useAppStore.getState();

        completeOnboarding();

        const state = useAppStore.getState();
        expect(state.stats.hasSeenOnboarding).toBe(true);
    });

    it('should increment streak and session stats', () => {
        const { incrementStreak } = useAppStore.getState();

        incrementStreak(5);

        let state = useAppStore.getState();
        expect(state.stats.currentStreak).toBe(1);
        expect(state.stats.completedSessionsCount).toBe(1);
        expect(state.stats.totalMinutes).toBe(5);

        incrementStreak(3);

        state = useAppStore.getState();
        expect(state.stats.currentStreak).toBe(2);
        expect(state.stats.completedSessionsCount).toBe(2);
        expect(state.stats.totalMinutes).toBe(8);
    });

    it('should toggle haptics', () => {
        const { toggleHaptics } = useAppStore.getState();

        toggleHaptics();

        let state = useAppStore.getState();
        expect(state.isHapticEnabled).toBe(false);

        toggleHaptics();

        state = useAppStore.getState();
        expect(state.isHapticEnabled).toBe(true);
    });
});
