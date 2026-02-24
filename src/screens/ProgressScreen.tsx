import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { theme } from '../theme';

export default function ProgressScreen() {
    const stats = useAppStore(state => state.stats);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tu Progreso</Text>

            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{stats.currentStreak}</Text>
                    <Text style={styles.statLabel}>Racha Actual</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{stats.longestStreak}</Text>
                    <Text style={styles.statLabel}>Mejor Racha</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.layout.spacing.md,
    },
    title: {
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.textPrimary,
        marginTop: theme.layout.spacing.xl,
        marginBottom: theme.layout.spacing.lg,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statBox: {
        flex: 1,
        backgroundColor: theme.colors.cardBackground,
        padding: theme.layout.spacing.md,
        borderRadius: theme.layout.borderRadius.md,
        marginHorizontal: theme.layout.spacing.xs,
        alignItems: 'center',
        ...theme.layout.shadows.subtle,
    },
    statValue: {
        fontSize: theme.typography.sizes.xxl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.accent,
    },
    statLabel: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textSecondary,
        marginTop: theme.layout.spacing.xs,
    }
});
