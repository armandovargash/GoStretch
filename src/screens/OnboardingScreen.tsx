import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { theme } from '../theme';

export default function OnboardingScreen({ navigation }: any) {
    const completeOnboarding = useAppStore(state => state.completeOnboarding);

    const handleStart = () => {
        completeOnboarding();
        // Re-render handled by AppNavigator observing state
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>GoStretch</Text>
            <Text style={styles.subtitle}>Crea el hábito de estirar cada día.</Text>

            <TouchableOpacity style={styles.button} onPress={handleStart}>
                <Text style={styles.buttonText}>Comenzar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.layout.spacing.lg,
    },
    title: {
        fontSize: theme.typography.sizes.xxl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.layout.spacing.sm,
    },
    subtitle: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.textSecondary,
        marginBottom: theme.layout.spacing.xxl,
        textAlign: 'center',
    },
    button: {
        backgroundColor: theme.colors.accent,
        paddingVertical: theme.layout.spacing.md,
        paddingHorizontal: theme.layout.spacing.xl,
        borderRadius: theme.layout.borderRadius.round,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: theme.colors.textInverse,
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.semibold,
    },
});
