# Islamic Companion 📱

Production-ready mobile application providing comprehensive spiritual tools and utilities for Muslims worldwide.

---

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (v0.86.3) with [Expo SDK 57](https://docs.expo.dev/)
- **Architecture**: React Native New Architecture enabled by default
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Routing & Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **UI & Animations**: React Native Core, `react-native-reanimated`, `react-native-gesture-handler`, `react-native-safe-area-context`, `react-native-screens`
- **Code Quality**: ESLint (with `eslint-config-expo`), Prettier
- **Package Manager**: npm

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- npm (v10+)
- For Android: [Android Studio](https://developer.android.com/studio) with Android SDK configured
- For iOS (macOS required): [Xcode](https://developer.apple.com/xcode/) and CocoaPods
- Alternatively: Expo Go app on a physical device

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npm start
# or
npx expo start
```

### 3. Run on Platforms

- **Android (Emulator / Connected Device)**:
  ```bash
  npm run android
  ```
- **iOS (Simulator / Connected Device - macOS only)**:
  ```bash
  npm run ios
  ```
- **Web**:
  ```bash
  npm run web
  ```

---

## 📁 Project Structure

```
├── .vscode/               # Editor configurations and recommended extensions
├── assets/                # App icons, splash screens, and static image assets
├── src/
│   ├── app/               # Expo Router screen routes & layouts
│   │   ├── _layout.tsx    # Root navigation layout
│   │   ├── index.tsx      # Home screen route
│   │   └── explore.tsx    # Explore screen route
│   ├── components/        # Reusable UI elements and helper components
│   ├── constants/         # Theme tokens, colors, and layout constants
│   └── hooks/             # Custom React hooks (e.g., color scheme, theme)
├── app.json               # Expo application configuration & metadata
├── eslint.config.js       # ESLint flat configuration (Expo recommended)
├── .prettierrc            # Prettier formatting rules
├── .prettierignore        # Prettier ignore rules
├── tsconfig.json          # TypeScript compiler options and path aliases (`@/*`)
└── package.json           # Dependencies and project scripts
```

---

## 🧪 Validation & Code Quality Scripts

```bash
# Type check TypeScript codebase
npm run typecheck

# Lint source files with ESLint
npm run lint

# Check code formatting with Prettier
npm run format:check

# Auto-format all files
npm run format

# Diagnose Expo dependencies and configuration
npx expo-doctor
```
