import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useThemeColors } from '../../theme/useThemeColors';
import { theme } from '../../theme';

interface AppTextProps extends TextProps {
    variant?: 'largeTitle' | 'title1' | 'title2' | 'title3' | 'headline' | 'body' | 'callout' | 'subhead' | 'footnote' | 'caption1';
    color?: 'primary' | 'secondary' | 'inverse' | 'accent' | 'success';
    weight?: 'regular' | 'medium' | 'semibold' | 'bold';
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export function AppText({
    style,
    variant = 'body',
    color = 'primary',
    weight,
    align = 'auto',
    children,
    ...props
}: AppTextProps) {
    const colors = useThemeColors();

    // Resolve raw color value
    const getRawColor = () => {
        switch (color) {
            case 'secondary': return colors.textSecondary;
            case 'inverse': return colors.textInverse;
            case 'accent': return colors.accent;
            case 'success': return colors.success;
            case 'primary':
            default: return colors.textPrimary;
        }
    };

    // Resolve typography variant based on iOS HIG styles
    const getVariantStyle = () => {
        switch (variant) {
            case 'largeTitle': return { fontSize: 34, lineHeight: 41, fontWeight: theme.typography.weights.bold };
            case 'title1': return { fontSize: 28, lineHeight: 34, fontWeight: theme.typography.weights.bold };
            case 'title2': return { fontSize: 22, lineHeight: 28, fontWeight: theme.typography.weights.bold };
            case 'title3': return { fontSize: 20, lineHeight: 25, fontWeight: theme.typography.weights.semibold };
            case 'headline': return { fontSize: 17, lineHeight: 22, fontWeight: theme.typography.weights.semibold };
            case 'body': return { fontSize: 17, lineHeight: 22, fontWeight: theme.typography.weights.regular };
            case 'callout': return { fontSize: 16, lineHeight: 21, fontWeight: theme.typography.weights.regular };
            case 'subhead': return { fontSize: 15, lineHeight: 20, fontWeight: theme.typography.weights.regular };
            case 'footnote': return { fontSize: 13, lineHeight: 18, fontWeight: theme.typography.weights.regular };
            case 'caption1': return { fontSize: 12, lineHeight: 16, fontWeight: theme.typography.weights.medium };
            default: return { fontSize: 17, lineHeight: 22, fontWeight: theme.typography.weights.regular }; // iOS Body Default
        }
    };

    const finalStyle = [
        styles.base,
        getVariantStyle(),
        { color: getRawColor(), textAlign: align },
        weight && { fontWeight: theme.typography.weights[weight] },
        style,
    ];

    return (
        <Text style={finalStyle} {...props}>
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    base: {
        fontFamily: 'System',
    },
});
