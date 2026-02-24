import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { theme } from '../theme';

export default function SessionFlowScreen({ navigation }: any) {
    const incrementStreak = useAppStore(state => state.incrementStreak);

    const handleFinish = () => {
        incrementStreak();
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reproductor de Sesión</Text>
            <Text style={styles.subtitle}>Aquí irá el temporizador y la ilustración de Nano Banana.</Text>

            <TouchableOpacity style={styles.button} onPress={handleFinish}>
                <Text style={styles.buttonText}>Finalizar Sesión (Simular)</Text>
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
        padding: theme.layout.spacing.md,
    },
    title: {
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.layout.spacing.sm,
    },
    subtitle: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.textSecondary,
        marginBottom: theme.layout.spacing.xl,
        textAlign: 'center',
    },
    button: {
        backgroundColor: theme.colors.success,
        paddingVertical: theme.layout.spacing.md,
        paddingHorizontal: theme.layout.spacing.xl,
        borderRadius: theme.layout.borderRadius.round,
        alignItems: 'center',
    },
    buttonText: {
        color: theme.colors.textInverse,
        fontWeight: theme.typography.weights.semibold,
    }
});
