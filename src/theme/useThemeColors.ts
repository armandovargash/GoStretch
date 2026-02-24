import { useColorScheme } from 'react-native';
import { colors } from './index'; // Default colors (Light mode base)

export function useThemeColors() {
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';

    return {
        ...colors, // Override specific colors for dark mode below
        background: isDark ? '#000000' : colors.background,
        cardBackground: isDark ? '#1C1C1E' : colors.cardBackground, // iOS System Gray 6
        textPrimary: isDark ? '#FFFFFF' : colors.textPrimary,
        textSecondary: isDark ? '#EBEBF599' : colors.textSecondary, // iOS Secondary Label Dark
        border: isDark ? '#38383A' : colors.border,
        overlay: isDark ? 'rgba(255,255,255,0.1)' : colors.overlay,
    };
}
