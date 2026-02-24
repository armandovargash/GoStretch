import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { theme } from '../theme';
import { useThemeColors } from '../theme/useThemeColors';
import { AppText } from '../components/ui/AppText';
import { AppButton } from '../components/ui/AppButton';

export default function OnboardingScreen({ navigation }: any) {
    const completeOnboarding = useAppStore(state => state.completeOnboarding);
    const colors = useThemeColors();

    const handleStart = () => {
        completeOnboarding();
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                {/* Placeholder for future Nano Banana Illustration */}
                <View style={styles.illustrationPlaceholder} />

                <AppText variant="largeTitle" align="center" style={styles.title}>
                    GoStretch
                </AppText>
                <AppText variant="body" color="secondary" align="center" style={styles.subtitle}>
                    Crea el hábito de estirar cada día. Sin sudor, sin material, solo alivio inmediato.
                </AppText>
            </View>

            <View style={styles.footer}>
                <AppButton title="Comenzar" size="lg" onPress={handleStart} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.layout.spacing.lg,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustrationPlaceholder: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: theme.colors.border,
        marginBottom: theme.layout.spacing.xxl,
    },
    title: {
        marginBottom: theme.layout.spacing.sm,
    },
    subtitle: {
        paddingHorizontal: theme.layout.spacing.md,
    },
    footer: {
        paddingBottom: theme.layout.spacing.xl,
    }
});
