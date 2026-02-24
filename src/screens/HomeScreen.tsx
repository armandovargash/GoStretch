import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { theme } from '../theme';

export default function HomeScreen({ navigation }: any) {
    const stats = useAppStore(state => state.stats);

    const startSession = () => {
        navigation.navigate('SessionFlow');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>Hola, Usuario</Text>
            <Text style={styles.streak}>Racha actual: {stats.currentStreak} días</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Recomendación del día</Text>
                <Text style={styles.cardSubtitle}>Full Body Release (3 min)</Text>
                <TouchableOpacity style={styles.button} onPress={startSession}>
                    <Text style={styles.buttonText}>Iniciar</Text>
                </TouchableOpacity>
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
    greeting: {
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.textPrimary,
        marginTop: theme.layout.spacing.xl,
    },
    streak: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.textSecondary,
        marginBottom: theme.layout.spacing.lg,
    },
    card: {
        backgroundColor: theme.colors.cardBackground,
        padding: theme.layout.spacing.lg,
        borderRadius: theme.layout.borderRadius.lg,
        ...theme.layout.shadows.subtle,
    },
    cardTitle: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.layout.spacing.xs,
    },
    cardSubtitle: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.textPrimary,
        marginBottom: theme.layout.spacing.lg,
    },
    button: {
        backgroundColor: theme.colors.accent,
        paddingVertical: theme.layout.spacing.sm,
        borderRadius: theme.layout.borderRadius.round,
        alignItems: 'center',
    },
    buttonText: {
        color: theme.colors.textInverse,
        fontWeight: theme.typography.weights.semibold,
    }
});
