import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function LibraryScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Biblioteca</Text>
            <Text style={styles.subtitle}>Sesiones disponibles próximamente.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.layout.spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
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
    },
});
