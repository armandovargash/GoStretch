/**
 * Global Design System for GoStretch
 * Adheres strictly to the Apple Human Interface Guidelines (HIG) and the provided PRD.
 */

export const colors = {
    // Brand
    accent: '#FF7F7F',         // Coral / Soft Salmon (Primary interactive color)
    accentActive: '#FF8C8C',

    // Backgrounds
    background: '#F9F9FC',     // Ultra Light Gray for main screens
    cardBackground: '#FFFFFF', // Pure White for cards

    // Typography
    textPrimary: '#1A1A1A',    // Near black
    textSecondary: '#8E8E93',  // Mid gray (iOS standard secondary)
    textInverse: '#FFFFFF',

    // Semantic
    success: '#34C759',        // iOS Green
    border: '#E5E5EA',         // iOS System Gray 5
    overlay: 'rgba(0,0,0,0.5)'
};

export const typography = {
    sizes: {
        xs: 12,
        sm: 14,
        md: 16,     // Body
        lg: 20,     // Title 3
        xl: 24,     // Title 2
        xxl: 34,    // Large Title
    },
    weights: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    }
};

export const layout = {
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,     // Standard padding/margin
        lg: 24,     // Generous spacing
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 8,
        md: 16,     // Card radiuses
        lg: 20,
        round: 9999,
    },
    shadows: {
        subtle: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2, // Android fallback
        }
    }
};

export const theme = {
    colors,
    typography,
    layout,
};
