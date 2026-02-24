import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { theme } from '../theme';
import { useThemeColors } from '../theme/useThemeColors';
import { AppText } from '../components/ui/AppText';
import { mockSessions } from '../data/mockSessions';

const { width } = Dimensions.get('window');

export default function SessionFlowScreen({ route, navigation }: any) {
    const colors = useThemeColors();
    const incrementStreak = useAppStore(state => state.incrementStreak);
    const isHapticEnabled = useAppStore(state => state.isHapticEnabled);

    // Resolve session dynamically via navigation params (no hardcoding)
    const { sessionId } = route.params || {};
    const session = mockSessions.find(s => s.id === sessionId) || mockSessions[0];
    const stretches = session.stretches;

    // State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(stretches[0].duration);
    const [isFinished, setIsFinished] = useState(false);

    const currentStretch = stretches[currentIndex];
    const progressPercent = ((currentIndex) / stretches.length) * 100;

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prev) => prev - 1);
            }, 1000);
        } else if (isPlaying && timeRemaining === 0) {
            handleNextMove(true);
        }
        return () => clearInterval(interval);
    }, [isPlaying, timeRemaining]);

    const triggerHaptic = (type: 'light' | 'success') => {
        if (!isHapticEnabled) return;
        if (type === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const handleNextMove = useCallback((autoTriggered: boolean = false) => {
        if (currentIndex < stretches.length - 1) {
            if (!autoTriggered) triggerHaptic('light');
            setCurrentIndex((prev) => prev + 1);
            setTimeRemaining(stretches[currentIndex + 1].duration);
        } else {
            triggerHaptic('success');
            setIsPlaying(false);
            setIsFinished(true);
        }
    }, [currentIndex, stretches]);

    const togglePlayPause = () => {
        triggerHaptic('light');
        setIsPlaying(!isPlaying);
    };

    const handleFinishSession = () => {
        incrementStreak();
        navigation.goBack();
    };

    const handleClose = () => {
        navigation.goBack();
    };

    if (isFinished) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.finishedContent}>
                    <AppText variant="largeTitle" align="center" style={styles.title}>¡Completado!</AppText>
                    <AppText variant="body" color="secondary" align="center" style={styles.subtitle}>
                        Un día más cuidando de ti.
                    </AppText>
                    <TouchableOpacity
                        style={[styles.finishButton, { backgroundColor: colors.success }]}
                        onPress={handleFinishSession}
                    >
                        <AppText variant="headline" color="inverse" weight="semibold">Listo</AppText>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Top Bar: Close & Progress */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                    <Ionicons name="close" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
                    <View style={[styles.progressBarFill, { backgroundColor: colors.accent, width: `${progressPercent}%` }]} />
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Dynamic Illustration or Fallback */}
                {['back_extension', 'hamstring_stretch', 'quad_stretch'].includes(currentStretch.animationName) ? (
                    <Image
                        source={
                            currentStretch.animationName === 'back_extension'
                                ? require('../../assets/illustrations/back_extension.png')
                                : currentStretch.animationName === 'hamstring_stretch'
                                    ? require('../../assets/illustrations/hamstring_stretch.png')
                                    : require('../../assets/illustrations/quad_stretch.png')
                        }
                        style={styles.illustrationImage}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={[styles.illustrationPlaceholder, { backgroundColor: colors.cardBackground, shadowColor: colors.overlay }]}>
                        <AppText variant="caption1" color="secondary" align="center">
                            [Falta Imagen]
                            {'\n'}Prompt: Nano Banana
                        </AppText>
                    </View>
                )}

                <View style={styles.textContainer}>
                    <AppText variant="title1" align="center" style={styles.stretchName}>
                        {currentStretch.nameKey}
                    </AppText>
                    <AppText variant="body" color="secondary" align="center" style={styles.stretchDetail}>
                        {currentStretch.detailKey}
                    </AppText>
                </View>
            </View>

            {/* Controls & Timer */}
            <View style={styles.controlsContainer}>
                <AppText variant="largeTitle" align="center" weight="bold" style={[styles.timer, { color: timeRemaining <= 5 && timeRemaining > 0 ? colors.accent : colors.textPrimary }]}>
                    {timeRemaining}s
                </AppText>

                <View style={styles.buttonRow}>
                    <View style={styles.ghostIconSpace} /> {/* For centering */}

                    <TouchableOpacity
                        style={[styles.playPauseButton, { backgroundColor: colors.accent }]}
                        onPress={togglePlayPause}
                    >
                        <Ionicons name={isPlaying ? "pause" : "play"} size={44} color={colors.textInverse} style={{ marginLeft: isPlaying ? 0 : 4 }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.skipButton} onPress={() => handleNextMove(false)}>
                        <Ionicons name="play-skip-forward" size={32} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.layout.spacing.lg,
        paddingTop: theme.layout.spacing.sm,
        height: 60,
    },
    closeButton: {
        marginRight: theme.layout.spacing.md,
    },
    progressBarContainer: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.layout.spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustrationPlaceholder: {
        width: width * 0.75,
        height: width * 0.75,
        borderRadius: theme.layout.borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.layout.spacing.xxl,
        ...theme.layout.shadows.subtle,
        elevation: 4,
    },
    illustrationImage: {
        width: width * 0.75,
        height: width * 0.75,
        marginBottom: theme.layout.spacing.xxl,
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: theme.layout.spacing.lg,
    },
    stretchName: {
        marginBottom: theme.layout.spacing.xs,
    },
    stretchDetail: {
        minHeight: 60,
    },
    controlsContainer: {
        paddingBottom: theme.layout.spacing.xxl + 20,
        alignItems: 'center',
    },
    timer: {
        fontSize: 64, // Massive iOS style timer
        marginBottom: theme.layout.spacing.lg,
        fontVariant: ['tabular-nums'], // Prevents jumping digits
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    playPauseButton: {
        width: 88,
        height: 88,
        borderRadius: 44,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.layout.shadows.subtle,
    },
    skipButton: {
        position: 'absolute',
        right: theme.layout.spacing.xl,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ghostIconSpace: {
        position: 'absolute',
        left: theme.layout.spacing.xl,
        width: 60,
        height: 60,
    },
    finishedContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.layout.spacing.xl,
    },
    title: {
        marginBottom: theme.layout.spacing.sm,
    },
    subtitle: {
        marginBottom: theme.layout.spacing.xxl,
    },
    finishButton: {
        width: '100%',
        paddingVertical: theme.layout.spacing.md,
        borderRadius: theme.layout.borderRadius.round,
        alignItems: 'center',
    }
});
