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
│   │   └── favicon.png                    # Web favicon
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
├── scripts/                               # Node-based automated test scripts
│   ├── test-qibla-haptics.js              # Unit tests for angle wraparound, tolerance & haptic triggers (22 tests)
│   └── test-prayer-schedule.js            # Unit tests for time parsing, countdown & next prayer derivation (14 tests)
├── src/                                   # Application source code
│   ├── app/                               # Expo Router navigation routes (Thin Mount Layer)
│   │   ├── _layout.tsx                    # Root Stack layout, splash lock, & theme injection
│   │   ├── index.tsx                      # Startup route mounting SplashScreen
│   │   ├── language.tsx                   # Route mounting LanguageSelectionScreen
│   │   ├── permissions.tsx                # Route mounting PermissionsScreen
│   │   ├── qibla.tsx                      # Standalone modal route mounting QiblaScreen
│   │   ├── tasbeeh.tsx                    # Standalone route mounting TasbeehScreen
│   │   ├── onboarding/                    # Onboarding step routes
│   │   │   ├── step-1.tsx                 # Route mounting OnboardingStep1 (Welcome & Mosque art)
│   │   │   └── step-2.tsx                 # Route mounting OnboardingStep2 (Feature cards)
│   │   └── (tabs)/                        # Bottom Tab Navigator group
│   │       ├── _layout.tsx                # Tab bar configuration & custom themed SVG tab icons
│   │       ├── index.tsx                  # Home tab route mounting HomeScreen
│   │       ├── prayer.tsx                 # Prayer Times tab route mounting PrayerTimesScreen
│   │       ├── qibla.tsx                  # Qibla tab route mounting QiblaScreen
│   │       ├── quran.tsx                  # Holy Qur'an placeholder tab route
│   │       ├── hadith.tsx                 # Hadith collections placeholder tab route
│   │       └── more.tsx                   # Segmented tab switcher mounting Tasbeeh and Calendar
│   ├── components/                        # Shared, domain-agnostic UI primitives
│   │   ├── layout/
│   │   │   └── ScreenContainer.tsx        # Safe area inset wrapper + theme canvas background
│   │   ├── typography/
│   │   │   └── ThemedText.tsx             # Typed typography component with variant/color tokens
│   │   ├── ui/
│   │   │   └── PrimaryButton.tsx          # Pill-shaped brand action button with touch feedback
│   │   ├── illustrations/                 # Vector SVG illustrations & decorative art
│   │   │   ├── IslamicPatternOverlay.tsx  # Geometric Islamic Girih background watermark
│   │   │   ├── SplashGoldenEmblem.tsx     # 8-point geometric star Islamic emblem
│   │   │   ├── OnboardingMosqueArt.tsx    # Landscape layered mosque illustration
│   │   │   ├── IsometricKaaba.tsx         # 3D isometric Kaaba representation
│   │   │   └── index.ts                   # Illustrations barrel export
│   │   └── index.ts                       # Public shared components export barrier
│   ├── context/                           # Shared application context
│   │   └── LocationContext.tsx            # Single source of truth for GPS coordinates & reverse geocoding
│   ├── features/                          # Self-contained modular domain features (<=250 lines/file)
│   │   ├── calendar/                      # Islamic Calendar domain
│   │   │   ├── components/
│   │   │   │   ├── CalendarScreen.tsx     # Main calendar screen container
│   │   │   │   ├── CalendarHeroHeader.tsx # Month navigation bar & Hijri month/year banner
│   │   │   │   ├── CalendarSelectedDateCard.tsx # Selected date details & Friday badge
│   │   │   │   ├── CalendarMonthGrid.tsx  # 7-column weekday grid container
│   │   │   │   ├── CalendarDayCell.tsx    # Individual day cell slot with touch affordance
│   │   │   │   └── IslamicEventsCard.tsx  # Upcoming religious events list
│   │   │   ├── data/
│   │   │   │   └── calendar.mock.ts       # Month names, Hijri mapping, and event fixtures
│   │   │   ├── types/
│   │   │   │   └── calendar.types.ts      # CalendarDay, IslamicEvent interfaces
│   │   │   └── index.ts                   # Public calendar feature export
│   │   ├── home/                          # Home dashboard domain
│   │   │   ├── components/
│   │   │   │   ├── HomeScreen.tsx         # Dashboard coordinator with safe area layout
│   │   │   │   ├── HomeUserBar.tsx        # Greeting, avatar, location & quick action buttons
│   │   │   │   ├── HomeNextPrayerHero.tsx # Spotlight card with live countdown
│   │   │   │   ├── HomePrayerTimetable.tsx# Daily prayer list sheet with active highlight
│   │   │   │   └── HomeTasbeehCard.tsx    # Quick-access Tasbeeh card
│   │   │   ├── data/
│   │   │   │   └── home.mock.ts           # Mock user profile & initial timetable
│   │   │   ├── types/
│   │   │   │   └── home.types.ts          # HomeDashboardData, HomePrayerItem interfaces
│   │   │   └── index.ts                   # Public home feature export
│   │   ├── onboarding/                    # Startup onboarding & configuration domain
│   │   │   ├── components/
│   │   │   │   ├── SplashScreen.tsx       # Auto-advancing splash screen with brand emblem
│   │   │   │   ├── OnboardingStep1.tsx    # Step 1: Mosque art, welcome copy, pagination
│   │   │   │   ├── OnboardingStep2.tsx    # Step 2: Feature list cards & pagination
│   │   │   │   ├── LanguageSelectionScreen.tsx # Multi-language interactive selection list
│   │   │   │   ├── PermissionsScreen.tsx  # Screen container for consent options
│   │   │   │   └── PermissionCard.tsx     # Reusable individual permission toggle card
│   │   │   ├── data/
│   │   │   │   └── onboarding.mock.ts     # Mock features, supported languages, permissions
│   │   │   ├── types/
│   │   │   │   └── onboarding.types.ts    # LanguageOption, PermissionItem, FeatureItem
│   │   │   └── index.ts                   # Public onboarding feature export
│   │   ├── prayer-times/                  # Prayer timetable domain
│   │   │   ├── components/
│   │   │   │   ├── PrayerTimesScreen.tsx  # Screen container with monthly timetable link
│   │   │   │   ├── PrayerTimesHeader.tsx  # Header bar & Gregorian/Hijri date display
│   │   │   │   ├── PrayerScheduleList.tsx # 5-prayer timetable card with Asr highlight
│   │   │   │   └── PrayerSettingsCard.tsx # Calculation method & madhab summary card
│   │   │   ├── data/
│   │   │   │   └── prayer-times.mock.ts   # Daily Salah schedule, calculation method fixture
│   │   │   ├── types/
│   │   │   │   └── prayer-times.types.ts  # PrayerScheduleItem, PrayerTimesScreenData
│   │   │   └── index.ts                   # Public prayer times feature export
│   │   ├── qibla/                         # Qibla Finder domain
│   │   │   ├── components/
│   │   │   │   ├── QiblaScreen.tsx        # Screen coordinator combining header, banner & dial
│   │   │   │   ├── QiblaHeader.tsx        # Top header bar, haptics toggle & refresh button
│   │   │   │   ├── QiblaStatusBanner.tsx  # Bearing readout, aligned badge & calibration hint
│   │   │   │   ├── CompassDial.tsx        # Large circular compass assembly with central Kaaba
│   │   │   │   ├── CompassDialFace.tsx    # Static base compass dial with radial ticks & rose
│   │   │   │   ├── CompassNeedle.tsx      # Dual-tone rotating needle assembly
│   │   │   │   └── QiblaInfoCard.tsx      # Location name, coordinates & refresh button
│   │   │   ├── data/
│   │   │   │   └── qibla.mock.ts          # Fallback coordinates, location label, default angle
│   │   │   ├── hooks/
│   │   │   │   ├── useDeviceHeading.ts    # Magnetometer hardware heading subscription hook
│   │   │   │   └── useQiblaCompass.ts     # Consolidated Qibla compass hook
│   │   │   ├── types/
│   │   │   │   └── qibla.types.ts         # SensorAccuracy, DynamicQiblaState interfaces
│   │   │   ├── utils/
│   │   │   │   ├── qibla-geometry.ts      # Great Circle bearing, distance & angle calculations
│   │   │   │   └── qibla-haptics.ts       # Alignment transition logic, debounce & vibration
│   │   │   └── index.ts                   # Public qibla feature export
│   │   └── tasbeeh/                       # Digital Tasbeeh domain
│   │       ├── components/
│   │       │   ├── TasbeehScreen.tsx      # Screen container with spiritual reminder
│   │       │   ├── TasbeehHeroHeader.tsx  # Top hero banner & back button
│   │       │   ├── TasbeehCounterDial.tsx # Interactive tap dial with progress ring & count
│   │       │   ├── SelectedDhikrCard.tsx  # Dhikr title, translation & Arabic calligraphy
│   │       │   ├── TargetSelectorRow.tsx  # Target pills (33, 99, 100, 1000)
│   │       │   └── TasbeehControlsRow.tsx # Undo and reset action buttons
│   │       ├── data/
│   │       │   └── tasbeeh.mock.ts        # Common Dhikr items, translations & default targets
│   │       ├── types/
│   │       │   └── tasbeeh.types.ts       # DhikrItem, TasbeehTarget types
│   │       └── index.ts                   # Public tasbeeh feature export
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
│   ├── types/                             # Global cross-cutting TypeScript declarations
│   │   ├── common.ts                      # Nullable<T>, AsyncStatus global types
│   │   └── location.types.ts              # GeoLocationCoords, LocationStatus types
│   └── utils/                             # Shared business logic and utilities
│       ├── location-formatter.ts          # Latitude/longitude cardinal formatting
│       ├── prayer-schedule.ts             # Time parsing, countdown string & next prayer logic
│       └── location-dev-logger.ts         # Development logging helper
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

| Directory / Layer         | Responsibility                            | Dependencies                                                | Placement Rule                                                                                    |
| :------------------------ | :---------------------------------------- | :---------------------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| `src/app/`                | Expo Router navigation routes & layouts   | `src/features/`, `src/theme/`, `src/components/`            | Thin mount points only. **Zero inline business logic or heavy styling**.                          |
| `src/features/<feature>/` | Self-contained domain modules             | `src/components/`, `src/theme/`, `src/types/`, `src/utils/` | Encapsulates components, mock data, hooks, and types for a single domain. Each file <= 250 lines. |
| `src/components/`         | Reusable, domain-agnostic UI primitives   | `src/theme/`, `react-native`, `react-native-svg`            | Pure presentation elements (`ScreenContainer`, `ThemedText`, `PrimaryButton`).                    |
| `src/context/`            | Cross-cutting runtime application state   | `src/types/`, `src/utils/`, `expo-location`                 | Global providers like `LocationContext`.                                                          |
| `src/utils/`              | Pure calculation and formatting utilities | None (domain-agnostic pure functions)                       | Prayer scheduling math, coordinate formatting. Reusable across features.                          |
| `src/theme/`              | Centralized design token system           | `react-native`                                              | Single source of truth for colors, spacing, typography, radii, and themes.                        |
| `src/types/`              | Cross-cutting TypeScript definitions      | None                                                        | Shared global interfaces (`Nullable`, `AsyncStatus`, `GeoLocationCoords`).                        |
| `assets/`                 | Static application assets                 | None                                                        | High-resolution icons, splash screens, and vector images.                                         |
| `docs/`                   | Architecture and knowledge documentation  | None                                                        | Living Markdown guides maintained across milestones.                                              |

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
