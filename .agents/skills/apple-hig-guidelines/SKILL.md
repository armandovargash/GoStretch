---
name: apple-hig-guidelines
description: Standard operating procedure for designing and implementing UIs that strictly adhere to Apple's Human Interface Guidelines (HIG) to maximize App Store featuring potential.
---

# Apple Human Interface Guidelines (HIG) Skill

This skill outlines the strict adherence to Apple's native design principles. The goal is to build an app that feels indistinguishable from a first-party Apple application.

## Core Philosophy
- **Clarity**: Text is legible at every size, icons are precise and lucid, adornments are subtle, and a sharpened focus on functionality motivates the design.
- **Deference**: Fluid motion and a crisp, beautiful interface help people understand and interact with content without competing with it.
- **Depth**: Visual layers and realistic motion impart vitality and heighten delight.

## Technical Constraints (No Paid External SDKs)
1. **Frameworks**: Prioritize wrappers for official Apple frameworks (e.g., using official Expo modules for Apple Auth, HealthKit, StoreKit) over third-party alternatives (like RevenueCat or Auth0) unless absolutely necessary and free.
2. **UI Components**: 
   - Use native iOS components wherever possible (Action Sheets, standard Navigation Bars, Tab Bars).
   - Avoid heavily customized, non-standard UI paradigms that break iOS conventions.
   - Use SF Symbols for iconography. Do not use external icon packs if a suitable SF Symbol exists.

## Typography and Colors
- **Typography**: Strictly use the San Francisco (SF Pro) font family. Use dynamic type to support accessibility settings automatically.
- **Colors**: Use iOS system colors and semantic colors (e.g., standard iOS Blue for interactive elements, standard background colors for Light/Dark mode). Always support Dark Mode flawlessly.

## Interactions
- Ensure standard gesture support (swipe back to pop navigation, scroll-to-top by tapping the status bar).
- Provide immediate haptic feedback (using standard `UIImpactFeedbackGenerator` equivalents) for meaningful actions.
