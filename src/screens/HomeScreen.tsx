import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { theme } from '../theme';
import { useThemeColors } from '../theme/useThemeColors';
import { AppText } from '../components/ui/AppText';
import { AppButton } from '../components/ui/AppButton';
import { Card } from '../components/ui/Card';

export default function HomeScreen({ navigation }: any) {
    const stats = useAppStore(state => state.stats);
    const colors = useThemeColors();

    const startSession = () => {
        navigation.navigate('SessionFlow');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <AppText variant="title1" style={styles.greeting}>Hola, Usuario</AppText>
            <AppText variant="subhead" color="secondary" style={styles.streak}>
                Racha actual: {stats.currentStreak} días
            </AppText>

            <Card style={styles.card}>
                <AppText variant="footnote" color="secondary" weight="semibold" style={styles.cardTitle}>
                    RECOMENDACIÓN DEL DÍA
                </AppText>
                <AppText variant="title2" style={styles.cardSubtitle}>
                    Full Body Release
                </AppText>
                <AppText variant="body" color="secondary" style={styles.cardDesc}>
                    3 min • 6 estiramientos
                </AppText>
                <AppButton title="Iniciar Sesión" onPress={startSession} style={styles.button} />
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.layout.spacing.lg,
    },
    greeting: {
        marginTop: theme.layout.spacing.xxl,
    },
    streak: {
        marginBottom: theme.layout.spacing.xl,
    },
    card: {
        marginTop: theme.layout.spacing.md,
    },
    cardTitle: {
        marginBottom: theme.layout.spacing.xs,
        letterSpacing: 0.5,
    },
    cardSubtitle: {
        marginBottom: theme.layout.spacing.xs,
    },
    cardDesc: {
        marginBottom: theme.layout.spacing.lg,
    },
    button: {
        marginTop: theme.layout.spacing.sm,
    }
});
