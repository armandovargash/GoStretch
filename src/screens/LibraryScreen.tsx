import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';
import { useThemeColors } from '../theme/useThemeColors';
import { AppText } from '../components/ui/AppText';
import { Card } from '../components/ui/Card';
import { mockSessions } from '../data/mockSessions';
import { useAppStore } from '../store/useAppStore';
import PaywallScreen from './PaywallScreen';

const { width } = Dimensions.get('window');

// Extend mock data visually for the Library demo
const librarySessions = [
    { ...mockSessions[0], isPremium: false, tag: 'Básico' },
    {
        id: 'desk-worker-001',
        name: 'Desk Worker Reset',
        overview: 'Libera la tensión del cuello y la zona lumbar tras horas frente al ordenador.',
        stretches: [],
        isPremium: true,
        tag: 'Pro'
    },
    {
        id: 'night-unwind-001',
        name: 'Night Unwind',
        overview: 'Afloja el sistema nervioso antes de dormir para un descanso profundo.',
        stretches: [],
        isPremium: true,
        tag: 'Pro'
    }
];

export default function LibraryScreen({ navigation }: any) {
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    const isHapticEnabled = useAppStore(state => state.isHapticEnabled);
    const [isPaywallVisible, setIsPaywallVisible] = useState(false);

    const handleSessionPress = (session: typeof librarySessions[0]) => {
        if (isHapticEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        if (session.isPremium) {
            if (isHapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setIsPaywallVisible(true);
        } else {
            navigation.navigate('SessionFlow', { sessionId: session.id });
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
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
                        Biblioteca
                    </AppText>
                    <AppText variant="body" color="secondary">
                        Tu dosis diaria de movilidad.
                    </AppText>
                </View>

                <View style={styles.list}>
                    {librarySessions.map((session) => (
                        <TouchableOpacity
                            key={session.id}
                            activeOpacity={0.8}
                            onPress={() => handleSessionPress(session)}
                            style={styles.cardWrapper}
                        >
                            <Card style={[styles.sessionCard, session.isPremium && styles.premiumCardBorder]}>
                                <View style={styles.cardHeader}>
                                    <AppText variant="title3" weight="semibold">
                                        {session.name}
                                    </AppText>
                                    {session.isPremium ? (
                                        <Ionicons name="lock-closed" size={20} color={colors.accent} />
                                    ) : (
                                        <View style={[styles.badge, { backgroundColor: colors.accent + '20' }]}>
                                            <AppText variant="caption1" color="accent" weight="bold">
                                                {session.tag}
                                            </AppText>
                                        </View>
                                    )}
                                </View>

                                <AppText variant="subhead" color="secondary" style={styles.overview}>
                                    {session.overview}
                                </AppText>

                                <View style={styles.cardFooter}>
                                    <View style={styles.metaData}>
                                        <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                                        <AppText variant="footnote" color="secondary" style={styles.metaText}>
                                            {session.isPremium ? '5 min' : '3 min'}
                                        </AppText>
                                    </View>
                                </View>

                                {/* Apple Native Blur Overlay for Premium content */}
                                {session.isPremium && (
                                    <BlurView
                                        intensity={colors.background === '#000000' ? 20 : 40}
                                        tint={colors.background === '#000000' ? "dark" : "light"}
                                        style={StyleSheet.absoluteFill}
                                    >
                                        <View style={styles.lockedOverlay}>
                                            <View style={[styles.lockCircle, { backgroundColor: colors.accent }]}>
                                                <Ionicons name="lock-closed" size={24} color={colors.textInverse} />
                                            </View>
                                            <AppText variant="headline" weight="semibold" style={{ marginTop: theme.layout.spacing.sm }}>
                                                Desbloquear Pro
                                            </AppText>
                                        </View>
                                    </BlurView>
                                )}
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Native iOS Paywall Modal */}
            <Modal
                visible={isPaywallVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setIsPaywallVisible(false)}
            >
                <PaywallScreen
                    onClose={() => setIsPaywallVisible(false)}
                    onPurchaseSuccess={() => {
                        setIsPaywallVisible(false);
                        // TODO: Update global isPro state once Apple Developer account is active
                    }}
                />
            </Modal>
        </View>
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
    list: {
        gap: theme.layout.spacing.lg,
    },
    cardWrapper: {
        width: '100%',
    },
    sessionCard: {
        minHeight: 140,
        position: 'relative',
        overflow: 'hidden',
    },
    premiumCardBorder: {
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.layout.spacing.sm,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    overview: {
        marginBottom: theme.layout.spacing.md,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 'auto',
    },
    metaData: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        marginLeft: 4,
    },
    lockedOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    lockCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.layout.shadows.subtle,
    }
});
