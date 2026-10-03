# Project Structure Guide

This document describes the directory structure, folder responsibilities, and file placement rules for the **Islamic Companion** mobile app.

---

## Directory Map

```
Islamic Companion
├── .vscode/                     # Recommended IDE extensions and configuration
├── assets/                      # App icons, splash screens, tab icons, static images
├── docs/                        # Project architectural documentation
│   ├── architecture.md          # Architecture overview and navigation flow
│   ├── project-structure.md     # Directory guide & file placement rules (this file)
│   ├── development-rules.md     # Developer workflow and coding standards
│   ├── theme-system.md          # Theming guide & design token system
│   └── features/
│       ├── onboarding.md        # Onboarding, Splash, Language, and Permissions
│       ├── home.md              # Home screen dashboard and quick access tools
│       ├── prayer-times.md      # Prayer Times UI and schedule fixtures
│       └── qibla.md             # Qibla compass UI module
├── src/
│   ├── app/                     # Expo Router navigation routes (Thin Mounts)
│   │   ├── _layout.tsx          # Root Stack navigator (Theme & Navigation Provider)
│   │   ├── index.tsx            # Entry Splash screen mount
│   │   ├── onboarding/
│   │   │   ├── step-1.tsx       # Onboarding Step 1 route
│   │   │   └── step-2.tsx       # Onboarding Step 2 route
│   │   ├── language.tsx         # Language selection screen route
│   │   ├── permissions.tsx      # Permissions screen route
│   │   └── (tabs)/              # Main application tab navigator
│   │       ├── _layout.tsx      # Tab bar layout (Home, Prayer, Qibla)
│   │       ├── index.tsx        # Home screen tab mount
│   │       ├── prayer.tsx       # Prayer Times tab mount
│   │       └── qibla.tsx        # Qibla Finder tab mount
│   ├── components/              # Shared generic UI primitives (domain-agnostic)
│   │   ├── layout/              # Layout building blocks (ScreenContainer)
│   │   ├── typography/          # Typography elements (ThemedText)
│   │   └── index.ts             # Public components export
│   ├── features/                # Domain-specific modules
│   │   ├── onboarding/          # Splash, Onboarding 1 & 2, Language, Permissions
│   │   ├── home/                # Home dashboard, daily verse, quick access cards
│   │   ├── prayer-times/        # Prayer timetable, weekly day strip, prayer items
│   │   └── qibla/               # Qibla compass, dial, needle, info card
│   ├── theme/                   # Centralized design token system
│   │   ├── tokens/              # Primitive values (colors, spacing, typography, radii)
│   │   ├── themes/              # Semantic themes (lightTheme, darkTheme)
│   │   ├── types.ts             # TypeScript interfaces for Theme and Tokens
│   │   ├── ThemeProvider.tsx    # Context provider with system-scheme detection
│   │   ├── useTheme.ts          # Custom hook to access theme values
│   │   └── index.ts             # Theme public export barrier
│   └── types/                   # Cross-cutting global TypeScript definitions
│       └── common.ts
├── AGENTS.md                    # Project-level agent rules adapted for React Native
├── app.json                     # Expo SDK configuration
├── eslint.config.js             # Flat ESLint configuration
├── tsconfig.json                # TypeScript configuration & path aliases
├── .prettierrc                  # Prettier code formatting rules
├── README.md                    # Project overview & running instructions
└── package.json                 # Dependencies and scripts
```
