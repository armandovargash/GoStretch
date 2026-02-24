---
name: reusable-ui-components
description: Standard operating procedure for building UI components in GoStretch to guarantee HIG adherence, Dark Mode support, and design consistency.
---

# Reusable UI Components Skill

This skill ensures that all UI elements in GoStretch use the centralized Design System. NEVER use raw React Native `<Text>` or `<View>` for styled interactive elements if a base App component exists.

## Core Rules

1. **Automatic Theme Resolution**: Every raw component MUST use the `useThemeColors` hook to determine if it should render light or dark mode colors dynamically based on the device settings (`useColorScheme()`).
2. **Typography Constraints**: Do not manually set `fontFamily` or `fontSize` raw numbers in individual screens. Use the exported variants from the `<AppText>` component (e.g., `variant="title1"`, `variant="body"`).
3. **Spacing**: Margins and paddings must reference `theme.layout.spacing`. Do not hardcode raw pixel values.
4. **Haptics**: Any interactive element (Button, Switch, Card pressed) MUST trigger a contextual haptic feedback using `expo-haptics` (if haptics are enabled in the global store).

## Component Generation Workflow
When asked to create a new UI element:
1. Stop and think: Does this belong in `/src/components/ui` as a base building block, or `/src/screens` as a unique layout?
2. If it is a base block, export it from `/src/components/ui/index.ts` so it can be easily imported across the app.
3. Always include `style` and `children` props to allow flexibility while enforcing base constraints.
