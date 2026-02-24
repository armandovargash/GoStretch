import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useThemeColors } from '../theme/useThemeColors';
import { AppText } from '../components/ui/AppText';
import { Card } from '../components/ui/Card';
import { useAppStore } from '../store/useAppStore';

const { width } = Dimensions.get('window');

// Mock data generator for a simple contribution graph/calendar
const generateMockHeatmap = () => {
    const days = [];
    const today = new Date();
    for (let i = 28; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        // Randomly assign "completed" status to days to simulate consistency
        const isCompleted = Math.random() > 0.4;
        days.push({
            date: d,
            completed: isCompleted,
            isToday: i === 0
        });
    }
    return days;
};

export default function ProgressScreen() {
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    const { streak, totalSessions, totalMinutes } = useAppStore(state => state.stats);

    // In a real app this would come from the store tracking actual completion dates
    const heatMapDays = React.useMemo(() => generateMockHeatmap(), []);

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={[
                styles.contentContainer,
                { paddingTop: insets.top + (80 - insets.top), paddingBottom: insets.bottom + 100 }
            ]}
            indicatorStyle={colors.background === '#000000' ? 'white' : 'black'}
        >
            <View style={styles.header}>
                <AppText variant="largeTitle" weight="bold" style={styles.title}>
                    Progreso
                </AppText>
                <AppText variant="body" color="secondary">
                    La consistencia supera la intensidad.
                </AppText>
            </View>

            {/* Streak Hero Card */}
            <Card style={styles.streakCard}>
                <View style={styles.streakHeader}>
                    <Ionicons name="flame" size={32} color={colors.accent} />
                    <AppText variant="largeTitle" weight="bold" color="primary" style={styles.streakNumber}>
                        {streak}
                    </AppText>
                </View>
                <AppText variant="headline" weight="semibold">
                    Días seguidos
                </AppText>
                <AppText variant="subhead" color="secondary" style={styles.streakSubtext}>
                    ¡Mantén el ritmo! Cada día cuenta para tu bienestar.
                </AppText>
            </Card>

            {/* Lifetime Stats */}
            <View style={styles.statsRow}>
                <Card style={styles.statBox}>
                    <AppText variant="title1" weight="bold" color="accent">
                        {totalSessions}
                    </AppText>
                    <AppText variant="caption1" color="secondary" weight="medium">
                        SESIONES
                    </AppText>
                </Card>
                <Card style={styles.statBox}>
                    <AppText variant="title1" weight="bold" color="accent">
                        {totalMinutes}
                    </AppText>
                    <AppText variant="caption1" color="secondary" weight="medium">
                        MINUTOS
                    </AppText>
                </Card>
            </View>

            {/* Consistency View - Apple iOS Github-like Graph */}
            <Card style={styles.heatmapCard}>
                <View style={styles.heatmapHeader}>
                    <AppText variant="headline" weight="semibold">
                        Últimos 28 Días
                    </AppText>
                    <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                </View>

                <View style={styles.heatmapGrid}>
                    {heatMapDays.map((day, index) => (
                        <View
                            key={index}
                            style={[
                                styles.heatMapCell,
                                {
                                    backgroundColor: day.completed
                                        ? colors.accent
                                        : colors.background // Subtle uncompleted state
                                },
                                day.isToday && styles.todayCell
                            ]}
                        />
                    ))}
                </View>
            </Card>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: theme.layout.spacing.lg,
    },
    header: {
        marginBottom: theme.layout.spacing.xxl,
    },
    title: {
        marginBottom: theme.layout.spacing.xs,
    },
    streakCard: {
        alignItems: 'center',
        paddingVertical: theme.layout.spacing.xxl,
        marginBottom: theme.layout.spacing.lg,
    },
    streakHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.layout.spacing.sm,
    },
    streakNumber: {
        fontSize: 48, // Override for massive hero metric
        lineHeight: 56,
        marginLeft: theme.layout.spacing.xs,
    },
    streakSubtext: {
        marginTop: theme.layout.spacing.sm,
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.layout.spacing.lg,
        gap: theme.layout.spacing.lg,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: theme.layout.spacing.lg,
    },
    heatmapCard: {
        marginBottom: theme.layout.spacing.xl,
    },
    heatmapHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.layout.spacing.lg,
    },
    heatmapGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        justifyContent: 'flex-start',
    },
    heatMapCell: {
        width: (width - (theme.layout.spacing.lg * 4) - (6 * 6)) / 7, // Responsive cell size
        aspectRatio: 1,
        borderRadius: 4,
        opacity: 0.8,
    },
    todayCell: {
        opacity: 1,
        borderWidth: 2,
        borderColor: theme.colors.textInverse, // Contrast border for today
    }
});
