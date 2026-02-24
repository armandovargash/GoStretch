import React from 'react';
import { View, ViewProps, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../theme/useThemeColors';
import { theme } from '../../theme';
import { useAppStore } from '../../store/useAppStore';

interface CardProps extends ViewProps {
    onPress?: () => void;
    noPadding?: boolean;
}

export function Card({
    style,
    children,
    onPress,
    noPadding = false,
    ...props
}: CardProps) {
    const colors = useThemeColors();
    const isHapticEnabled = useAppStore(state => state.isHapticEnabled);

    const containerStyle = [
        styles.card,
        { backgroundColor: colors.cardBackground },
        !noPadding && { padding: theme.layout.spacing.lg },
        style
    ];

    if (onPress) {
        const handlePress = () => {
            if (isHapticEnabled) {
                Haptics.selectionAsync(); // Subtle selection feel for cards
            }
            onPress();
        };

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={containerStyle}
                onPress={handlePress}
                {...(props as any)}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={containerStyle} {...props}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: theme.layout.borderRadius.lg,
        ...theme.layout.shadows.subtle,
        overflow: 'hidden', // Keeps inner content from breaking radius
        width: '100%',
    }
});
