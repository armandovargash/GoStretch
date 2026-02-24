---
name: expo-mobile-dev
description: Standard operating procedure and best practices for developing Expo/React Native applications without local Xcode.
---

# Expo Mobile Development Skill

This skill outlines the process for developing and deploying iOS applications using Expo and EAS (Expo Application Services).

## When to Use
- When scaffolding a new mobile app in this workspace.
- When generating React Native UI components.
- When configuring cloud builds for the App Store.

## Technology Stack Enforcement
1. **Core**: React Native + Expo SDK.
2. **Language**: TypeScript (Strict Mode).
3. **Routing**: Expo Router (File-based routing).
4. **Styling**: NativeWind (Tailwind CLI for React Native) or StyleSheet objects.

## Workflow Rules

### 1. Initialization
Always use `npx create-expo-app@latest ./ -t expo-template-blank-typescript` to scaffold if starting from scratch, or an appropriate template.

### 2. No Local iOS Builds
NEVER attempt to run `npx expo run:ios` or `pod install` unless explicitly instructed, as the environment does not rely on local Xcode.

### 3. EAS Integration
To build the app for the App Store:
1. `eas login` (Requires user interaction/tokens).
2. `eas build:configure` to generate `eas.json`.
3. `eas build --platform ios --profile production` to manually trigger a build on Expo's servers.

### 4. Component Creation
- Create functional components using modern hooks.
- Place reusable UI components in `/components`.
- Place screens in `/app` (Expo Router).

### 5. Assets
Use absolute paths or require for images within the `/assets` directory. Optimize images before adding them.
