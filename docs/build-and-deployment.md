# Build & Deployment Guide: Islamic Companion

This document provides complete instructions for generating installable Android APKs, configuring EAS Build profiles, managing dependencies, and details the technical investigation of the cross-platform EAS build resolution.

---

## 1. Project Dependencies Analysis

| Dependency                                 | Purpose / Role                                          | Where Used                               | Classification |
| :----------------------------------------- | :------------------------------------------------------ | :--------------------------------------- | :------------- |
| `expo` (~57.0.26)                          | Core Expo runtime and managed workflow platform         | Root app runtime                         | Critical       |
| `expo-router` (~57.0.24)                   | File-based navigation and routing framework             | `src/app/`                               | Critical       |
| `react` (19.2.3) / `react-native` (0.86.3) | Core UI framework with New Architecture                 | Entire codebase                          | Critical       |
| `react-native-svg` (15.15.4)               | Scalable vector graphics rendering                      | Icons, Compass Dial, Mosque Art, Emblem  | Critical       |
| `react-native-safe-area-context` (~5.7.0)  | Device notch, status bar, and navigation bar insets     | `ScreenContainer.tsx`, `HomeScreen.tsx`  | Critical       |
| `react-native-screens` (~4.26.0)           | Native screen memory management & transition primitives | Navigation Stack / Tabs                  | Critical       |
| `expo-splash-screen` (~57.0.9)             | Controls native splash screen visibility                | `src/app/_layout.tsx`                    | Critical       |
| `expo-status-bar` (~57.0.1)                | Dynamic status bar theme styling (light/dark)           | `ScreenContainer.tsx`, `HomeScreen.tsx`  | Critical       |
| `react-native-reanimated` (4.5.1)          | High-performance 60fps animations engine                | UI transitions & future compass rotation | Standard       |
| `react-native-gesture-handler` (~2.32.0)   | Native touch and gesture interaction layer              | Tab bar and list gestures                | Standard       |
| `expo-font` (~57.0.4)                      | Custom typography and icon fonts loader                 | Custom font loading                      | Standard       |
| `eslint` / `eslint-config-expo`            | Static analysis & code style enforcement                | Development / CI                         | Dev Tool       |
| `prettier`                                 | Deterministic code formatting                           | Development / CI                         | Dev Tool       |
| `typescript` (~6.0.3)                      | Strict type checking (`tsc --noEmit`)                   | Development / CI                         | Dev Tool       |

---

## 2. Configuration Files

### `app.json`

- **Application Name:** `Islamic Companion`
- **Application Slug:** `islamic-companion`
- **Application Version:** `1.0.0`
- **Android Application ID (Package):** `com.islamiccompanion.app`
- **Adaptive Icon Background:** `#0A3B2A` (Deep Forest Islamic Green)
- **EAS Project ID:** `80f309bb-7956-4b81-ae73-b89648d98fda`

### `eas.json`

```json
{
  "cli": {
    "version": ">= 15.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Build Profile Comparison

- **`development`**: Builds an internal development client APK containing debugging tools and local Metro connectivity.
- **`preview`**: Compiles a standalone, release-mode `.apk` file that can be side-loaded directly onto any physical Android device without Expo Go.
- **`production`**: Compiles an optimized Android App Bundle (`.aab`) ready for signing and upload to Google Play Console.

---

## 3. Step-by-Step Android APK Generation

### Prerequisites

1. Ensure you are logged into your Expo account:
   ```bash
   npx eas-cli whoami
   ```
2. Verify project code health:
   ```bash
   npm run typecheck
   npm run lint
   npm run format:check
   npx expo-doctor
   ```

### Triggering the Build

To generate an installable Android APK, run:

```bash
eas build --platform android --profile preview
```

### Build Process Flow

1. EAS CLI packages the local workspace (respecting `.gitignore`).
2. The archive is uploaded to EAS Cloud (Ubuntu Linux builder).
3. EAS creates or resolves the Android keystore credentials automatically.
4. The builder executes `npm ci --include=dev` to install clean dependencies.
5. Gradle runs `assembleRelease` to produce the standalone `.apk`.
6. EAS provides a shareable URL and QR code to download and install the APK on any Android phone.

---

## 4. Technical Case Study: The Cross-Platform EAS Dependency Resolution

### The Problem

During initial EAS cloud builds on Ubuntu Linux, the `Install dependencies` phase failed with:

```text
npm error code ERESOLVE
npm error Could not resolve dependency:
npm error optional node_modules/@unrs/resolver-binding-wasm32-wasi
npm error   node_modules/@unrs/resolver-binding-wasm32-wasi
npm error     @unrs/resolver-binding-wasm32-wasi@"1.11.3" from @emnapi/core@1.11.3
```

### Root Cause

1. `eslint-config-expo` depends on `eslint-import-resolver-typescript`, which depends on `unrs-resolver`.
2. `unrs-resolver` declares optional platform bindings, including `@unrs/resolver-binding-wasm32-wasi`.
3. When `npm install` is executed on a **Windows host**, npm resolves only Windows-native bindings into the active node tree and skips hoisting non-host wasm bindings (`@emnapi/core`, `@emnapi/runtime`) into the top-level `packages` map of `package-lock.json`.
4. When EAS runs on **Ubuntu Linux**, it runs `npm ci --include=dev`. `npm ci` strictly validates the entire dependency graph against `package-lock.json`. Because the hoisted entries were omitted by the Windows npm client, `npm ci` aborted with `ERESOLVE`.

### The Pure Lockfile Solution Applied

Rather than polluting `package.json` with direct unused devDependencies or adding fragile pre-install hooks, a **pure cross-platform lockfile fix** was applied:

1. Injected the missing hoisted package descriptors directly into `package-lock.json`:
   - `node_modules/@emnapi/core` (v1.11.3, sha512 integrity from npm registry)
   - `node_modules/@emnapi/runtime` (v1.11.3, sha512 integrity from npm registry)
2. Preserved `node_modules/@emnapi/wasi-threads` (v1.2.3) with its official registry integrity.
3. Verified `package.json` remained **100% untouched** (0 lines modified).
4. Verified `npm ci`, `npm run typecheck`, `npm run lint`, and `npx expo-doctor` passed cleanly.
