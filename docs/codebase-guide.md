# Codebase Guide: Islamic Companion

This document provides a comprehensive technical overview of the **Islamic Companion** mobile application codebase, directory architecture, component layout, and file-level responsibilities.

---

## 1. Complete Project Structure

```text
Islamic Companion
├── assets/                                # Static branding & multimedia assets
│   ├── images/                            # PNG/SVG image assets (icons, splash, backgrounds)
│   │   ├── android-icon-background.png   # Android adaptive icon background layer (#0A3B2A)
│   │   ├── android-icon-foreground.png   # Android adaptive icon foreground emblem
│   │   ├── android-icon-monochrome.png   # Android monochrome themed icon
│   │   ├── icon.png                       # Standard square application icon (1024x1024)
│   │   ├── splash-icon.png                # Native splash screen centered icon
│   │   ├── favicon.png                    # Web favicon
│   │   └── tabIcons/                      # Supplementary tab navigation assets
│   └── expo.icon/                         # iOS icon assets container
├── docs/                                  # Living architectural documentation
│   ├── architecture.md                    # Core architecture principles & navigation tree
│   ├── architecture-notes.md              # Deep-dive architecture notes & data flows
│   ├── codebase-guide.md                  # Comprehensive codebase guide (this file)
│   ├── client-qa.md                       # Factual Q&A answers for client alignment
│   ├── developer-quick-reference.md       # Practical developer cheat sheet for extensions
│   ├── implemented-vs-future.md           # Implemented vs planned feature matrix
│   ├── build-and-deployment.md            # EAS Build, Android APK generation & CI guide
│   ├── development-rules.md               # Coding standards & verification checklist
│   ├── project-structure.md               # Directory layering rules
│   ├── theme-system.md                    # Theme token reference
│   └── features/                          # Feature-specific documentation
│       ├── onboarding.md                  # Splash, Onboarding 1-2, Language, Permissions
│       ├── home.md                        # Home dashboard & quick access tools
│       ├── prayer-times.md                # Prayer times timetable & settings
│       └── qibla.md                       # Qibla compass & Kaaba alignment UI
├── src/                                   # Application source code
│   ├── app/                               # Expo Router navigation routes (Thin Mount Layer)
│   │   ├── _layout.tsx                    # Root Stack layout, splash lock, & theme injection
│   │   ├── index.tsx                      # Startup route mounting SplashScreen
│   │   ├── language.tsx                   # Route mounting LanguageSelectionScreen
│   │   ├── permissions.tsx                # Route mounting PermissionsScreen
│   │   ├── qibla.tsx                      # Standalone modal route mounting QiblaScreen
│   │   ├── onboarding/                    # Onboarding step routes
│   │   │   ├── step-1.tsx                 # Route mounting OnboardingStep1 (Welcome & Mosque art)
│   │   │   └── step-2.tsx                 # Route mounting OnboardingStep2 (Feature cards)
│   │   └── (tabs)/                        # Bottom Tab Navigator group
│   │       ├── _layout.tsx                # Tab bar configuration & custom SVG tab icons
│   │       ├── index.tsx                  # Home tab route mounting HomeScreen
│   │       ├── prayer.tsx                 # Prayer Times tab route mounting PrayerTimesScreen
│   │       ├── qibla.tsx                  # Qibla tab route mounting QiblaScreen
│   │       ├── quran.tsx                  # Holy Qur'an placeholder tab route
│   │       ├── hadith.tsx                 # Hadith collections placeholder tab route
│   │       └── more.tsx                   # Islamic Tools & Settings placeholder tab route
│   ├── components/                        # Shared, domain-agnostic UI primitives
│   │   ├── layout/
│   │   │   └── ScreenContainer.tsx        # Safe area inset wrapper + theme canvas background
│   │   ├── typography/
│   │   │   └── ThemedText.tsx             # Typed typography component with variant/color tokens
│   │   ├── ui/
│   │   │   ├── PrimaryButton.tsx          # Pill-shaped brand action button with touch feedback
│   │   │   └── collapsible.tsx            # Expandable collapsible container
│   │   ├── illustrations/                 # Vector SVG illustrations & decorative art
│   │   │   ├── IslamicPatternOverlay.tsx  # Geometric Islamic Girih background watermark
│   │   │   ├── SplashGoldenEmblem.tsx     # 8-point geometric star Islamic emblem
│   │   │   ├── OnboardingMosqueArt.tsx    # Landscape layered mosque illustration
│   │   │   ├── IsometricKaaba.tsx         # 3D isometric Kaaba representation
│   │   │   └── index.ts                   # Illustrations barrel export
│   │   ├── external-link.tsx              # Web link helper
│   │   ├── themed-text.tsx                # Legacy template text primitive
│   │   ├── themed-view.tsx                # Legacy template view primitive
│   │   └── index.ts                       # Public shared components export barrier
│   ├── constants/                         # Legacy template theme constants
│   │   └── theme.ts                       # Default fallback palette & typography constants
│   ├── features/                          # Self-contained modular domain features
│   │   ├── home/                          # Home dashboard domain
│   │   │   ├── components/
│   │   │   │   └── HomeScreen.tsx         # User greeting, next prayer card, daily timetable
│   │   │   ├── data/
│   │   │   │   └── home.mock.ts           # Mock user profile, next prayer & schedule fixture
│   │   │   ├── types/
│   │   │   │   └── home.types.ts          # HomeDashboardData, HomePrayerItem interfaces
│   │   │   └── index.ts                   # Public home feature export
│   │   ├── onboarding/                    # Startup onboarding & configuration domain
│   │   │   ├── components/
│   │   │   │   ├── SplashScreen.tsx       # Auto-advancing splash screen with brand emblem
│   │   │   │   ├── OnboardingStep1.tsx    # Step 1: Mosque art, welcome copy, pagination
│   │   │   │   ├── OnboardingStep2.tsx    # Step 2: Feature list cards & pagination
│   │   │   │   ├── LanguageSelectionScreen.tsx # Multi-language interactive selection list
│   │   │   │   └── PermissionsScreen.tsx  # Location, notifications, storage toggles
│   │   │   ├── data/
│   │   │   │   └── onboarding.mock.ts     # Mock features, supported languages, permissions
│   │   │   ├── types/
│   │   │   │   └── onboarding.types.ts    # LanguageOption, PermissionItem, FeatureItem
│   │   │   └── index.ts                   # Public onboarding feature export
│   │   ├── prayer-times/                  # Prayer timetable domain
│   │   │   ├── components/
│   │   │   │   └── PrayerTimesScreen.tsx  # Date header, 5-prayer timetable, method settings
│   │   │   ├── data/
│   │   │   │   └── prayer-times.mock.ts   # Daily Salah schedule, calculation method fixture
│   │   │   ├── types/
│   │   │   │   └── prayer-times.types.ts  # PrayerScheduleItem, PrayerTimesScreenData
│   │   │   └── index.ts                   # Public prayer times feature export
│   │   └── qibla/                         # Qibla Finder domain
│   │       ├── components/
│   │       │   ├── CompassDial.tsx        # 360-degree compass dial, tick marks & rotating Kaaba
│   │       │   ├── CompassNeedle.tsx      # Magnetic needle and Kaaba center cube
│   │       │   ├── QiblaInfoCard.tsx      # Location name, coordinates & refresh button
│   │       │   └── QiblaScreen.tsx        # Qibla screen container & degree readout
│   │       ├── data/
│   │       │   └── qibla.mock.ts          # Mock coordinates, location label, and default angle
│   │       ├── types/
│   │       │   └── qibla.types.ts         # QiblaUiState, QiblaLocationMock interfaces
│   │       └── index.ts                   # Public qibla feature export
│   ├── hooks/                             # Custom React hooks
│   │   ├── use-color-scheme.ts            # Native color scheme accessor
│   │   ├── use-color-scheme.web.ts        # Web color scheme accessor
│   │   └── use-theme.ts                   # Legacy theme helper
│   ├── theme/                             # Centralized multi-theme design token engine
│   │   ├── tokens/
│   │   │   ├── colors.ts                  # Raw color palettes (Forest Green, Gold, Cream, Slate)
│   │   │   ├── radii.ts                   # Border radius scale (xs to full)
│   │   │   ├── spacing.ts                 # Spacing scale (xxs to xxxl)
│   │   │   └── typography.ts              # Font sizes, line heights, and font weights
│   │   ├── themes/
│   │   │   ├── light.ts                   # Light theme semantic color mappings
│   │   │   └── dark.ts                    # Dark theme semantic color mappings
│   │   ├── types.ts                       # SemanticColors, Theme, ThemeMode interfaces
│   │   ├── ThemeProvider.tsx              # Context Provider with system-scheme synchronization
│   │   ├── useTheme.ts                    # Main hook for consuming active theme
│   │   └── index.ts                       # Theme system export barrier
│   └── types/                             # Global cross-cutting TypeScript declarations
│       └── common.ts                      # Nullable<T>, AsyncStatus global types
├── AGENTS.md                              # Senior engineering guidelines & verification rules
├── app.json                               # Expo SDK 57 manifest & native configuration
├── eas.json                               # Expo Application Services (EAS) build profiles
├── eslint.config.js                       # Flat ESLint configuration (eslint-config-expo)
├── package.json                           # NPM dependencies, metadata & verification scripts
├── package-lock.json                      # Deterministic cross-platform dependency lockfile
├── README.md                              # Project introduction & quick start guide
└── tsconfig.json                          # TypeScript configuration with `@/*` path mapping
```

---

## 2. Directory Responsibilities & Layering Rules

| Directory / Layer         | Responsibility                           | Dependencies                                     | Placement Rule                                                                 |
| :------------------------ | :--------------------------------------- | :----------------------------------------------- | :----------------------------------------------------------------------------- |
| `src/app/`                | Expo Router navigation routes & layouts  | `src/features/`, `src/theme/`, `src/components/` | Thin mount points only. **Zero inline business logic or heavy styling**.       |
| `src/features/<feature>/` | Self-contained domain modules            | `src/components/`, `src/theme/`, `src/types/`    | Encapsulates components, mock data, hooks, and types for a single domain.      |
| `src/components/`         | Reusable, domain-agnostic UI primitives  | `src/theme/`, `react-native`, `react-native-svg` | Pure presentation elements (`ScreenContainer`, `ThemedText`, `PrimaryButton`). |
| `src/theme/`              | Centralized design token system          | `react-native`                                   | Single source of truth for colors, spacing, typography, radii, and themes.     |
| `src/types/`              | Cross-cutting TypeScript definitions     | None                                             | Shared global interfaces (`Nullable`, `AsyncStatus`).                          |
| `assets/`                 | Static application assets                | None                                             | High-resolution icons, splash screens, and vector images.                      |
| `docs/`                   | Architecture and knowledge documentation | None                                             | Living Markdown guides maintained across milestones.                           |

---

## 3. Thin Route Layer Pattern

All files in `src/app/` adhere strictly to the **Thin Route Layer** pattern. A route file acts exclusively as a mount point that delegates rendering directly to its corresponding feature component:

```tsx
// src/app/language.tsx
import { LanguageSelectionScreen } from '@/features/onboarding';

export default function LanguageRoute() {
  return <LanguageSelectionScreen />;
}
```

This guarantees that:

1. Routing logic can change without rewriting feature layouts.
2. Feature screens can be tested, mocked, or embedded in isolation.
3. Code stays modular, strictly typed, and easy to maintain.
