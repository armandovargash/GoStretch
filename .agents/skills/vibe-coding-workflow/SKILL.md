---
name: vibe-coding-workflow
description: Standard operating procedure for high-velocity, context-driven "Vibe Coding" between the user and the agent.
---

# Vibe Coding Workflow

"Vibe Coding" relies heavily on extreme context sharing, rapid prototyping, and fluid iteration. The goal is to move from idea to execution with zero friction.

## Core Principles
1. **Context is King**: Always ensure the agent has the latest Context (like `.cursorrules`, skill files, and architectural decisions).
2. **Action Bias**: The agent should execute safely rather than asking for permission at every micro-step. Use `SafeToAutoRun: true` in workflows where applicable and non-destructive.
3. **Show, Don't Tell**: Whenever a UI change is made, heavily lean on describing the visual impact or providing clear instructions on how the user can test it instantly on their device (via Expo Go).

## The Loop
1. **User Request**: User provides a high-level intent ("Make the onboarding feel more like Apple Fitness").
2. **Context Retrieval**: Agent quickly scans `apple-hig-guidelines` and existing component structures.
3. **Rapid Execution**: Agent modifies code, focusing on fluid animations and native feel.
4. **Instant Feedback**: Agent instructs user to save/reload the Expo app to feel the "vibe" of the new animation/layout.
5. **Iteration**: User gives emotional or vibe-based feedback ("Too bouncy", "Make it darker"), agent refines.

## Continuous Delivery to App Store
To maintain this vibe, deployment must be frictionless.
- Use `eas update` for over-the-air (OTA) updates for rapid testing on TestFlight without waiting for Apple review (for JavaScript/asset changes).
- Use `eas build --auto-submit` to automatically send binaries to App Store Connect when native code changes are required.
