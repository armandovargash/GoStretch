import React from 'react';
import {
    TouchableOpacity,
    TouchableOpacityProps,
    StyleSheet,
    ActivityIndicator,
    ViewStyle
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppText } from './AppText';
import { useThemeColors } from '../../theme/useThemeColors';
import { theme } from '../../theme';
import { useAppStore } from '../../store/useAppStore';

interface AppButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export function AppButton({
    title,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    style,
    onPress,
    disabled,
    ...props
}: AppButtonProps) {
    const colors = useThemeColors();
    const isHapticEnabled = useAppStore(state => state.isHapticEnabled);

    const handlePress = (e: any) => {
        if (disabled || isLoading) return;

        if (isHapticEnabled) {
            // Light impact for standard buttons (Apple HIG)
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        if (onPress) onPress(e);
    };

    const getBackgroundColor = (): string => {
        if (disabled) return colors.border;
        switch (variant) {
            case 'primary': return colors.accent;
            case 'secondary': return colors.cardBackground;
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            default: return colors.accent;
        }
    };

    const getTextColorColorName = (): 'primary' | 'inverse' | 'accent' => {
        if (disabled) return 'secondary';
        switch (variant) {
            case 'primary': return 'inverse';
            case 'secondary': return 'primary';
            case 'outline': return 'accent';
            case 'ghost': return 'accent';
            default: return 'inverse';
        }
    };

    const getPadding = () => {
        switch (size) {
            case 'sm': return { paddingVertical: 8, paddingHorizontal: 16 };
            case 'lg': return { paddingVertical: 18, paddingHorizontal: 32 };
            case 'md':
            default: return { paddingVertical: 14, paddingHorizontal: 24 };
        }
    };

    const getBorderStyles = (): ViewStyle => {
        if (variant === 'outline') {
            return { borderWidth: 1, borderColor: disabled ? colors.border : colors.accent };
        }
        return {};
    };

    const containerStyle = [
        styles.container,
        getPadding(),
        getBorderStyles(),
        { backgroundColor: getBackgroundColor() },
        style
    ];

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={containerStyle}
            onPress={handlePress}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'primary' ? colors.textInverse : colors.accent} />
            ) : (
                <AppText
                    variant="headline"
                    weight="semibold"
                    color={getTextColorColorName()}
                    align="center"
                >
                    {title}
                </AppText>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: theme.layout.borderRadius.round, // Pill-shaped by default
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    }
});
