---
name: qa-testing-learnings
description: Standard operating procedure and learnings for setting up QA and automated testing in modern Expo (SDK 54+) and React Native (0.76+) environments, specifically addressing ESM and React 19 peer dependency issues.
---

# QA & Testing in Modern Expo (React 19 / SDK 54+)

This skill documents the critical learnings and standard operating procedures for implementing automated testing in the bleeding-edge GoStretch stack. The traditional React Native testing stack (Jest + React Test Renderer) frequently breaks with the introduction of React 19 and Expo's new architecture.

## 1. The Core Issue: Jest & React 19 Peer Dependencies

When attempting to install `@testing-library/react-native` and `react-test-renderer` in an Expo SDK 54 project using React 19, you will encounter immediate and fatal ESM (ECMAScript Module) scope errors and `ERESOLVE` dependency conflicts.

**Symptoms:**
- `npm error Conflicting peer dependency: react@19.2.4`
- `ReferenceError: You are trying to import a file outside of the scope of the test code.` (originating from `expo/src/winter/runtime.native.ts`)
- `Cannot find module 'babel-preset-expo'`

## 2. Standard Operating Procedure (SOP) for New Tests

Do **NOT** attempt to force Jest to work by endlessly tweaking `babel.config.js` or using `--legacy-peer-deps` for core test renderers, as the Expo ESM pipeline will still fail during runtime execution.

### The Solution: Vitest

Vitest is ESM-native and bypasses the Babel transpilation scope issues that plague Jest in modern React Native environments.

**Step 1: Installation**
```bash
npx vitest
# Accept the prompt to install vitest
```

**Step 2: File Configuration**
Ensure your test files use Vitest's explicit imports, as globals are not injected by default in the same way Jest does.

```typescript
// ALWAYS import these at the top of your .test.ts files
import { describe, it, expect, beforeEach } from 'vitest';
```

**Step 3: Mocking Native Modules (Zustand/AsyncStorage)**
When testing global state (`useAppStore.ts`), you must reset the state manually in the `beforeEach` block, as `AsyncStorage` is a native module that won't behave normally in a Node test environment.

```typescript
beforeEach(() => {
    useAppStore.setState({
      stats: {
        currentStreak: 0,
        longestStreak: 0,
        completedSessionsCount: 0,
        hasSeenOnboarding: false,
        totalMinutes: 0,
      },
      isHapticEnabled: true,
    });
});
```

## 3. Rules & Constraints
- **Rule 1:** Always use Vitest for unit testing logic and state management (Zustand).
- **Rule 2:** Avoid component testing (UI rendering) until `@testing-library/react-native` releases full, stable support for React 19. Rely on E2E testing (like Detox or Maestro) for UI verification instead of React Test Renderer.
- **Rule 3:** Never use `jest.mock` syntax in Vitest files; use `vi.mock` if module mocking is strictly necessary.
