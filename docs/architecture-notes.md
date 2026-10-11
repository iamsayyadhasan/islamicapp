# Deep-Dive Architecture Notes: Islamic Companion

This document provides in-depth technical analysis of application startup, routing, screen execution, data flow, the design token engine, and component hierarchy.

---

## 1. Application Entry & Routing Lifecycle

The application uses **Expo Router v4 / SDK 57** file-based navigation mounted at `expo-router/entry`.

```text
App Launch
    │
    ▼
expo-router/entry
    │
    ▼
src/app/_layout.tsx (Root Stack Navigator)
    │  ├─ SplashScreen.preventAutoHideAsync() keeps native splash visible
    │  ├─ Wraps app in <AppThemeProvider> & <NavigationThemeProvider>
    │  └─ useEffect: calls SplashScreen.hideAsync() once root React component mounts
    │
    ▼
src/app/index.tsx (Entry Route)
    │  └─ Mounts <SplashScreen /> (features/onboarding)
    │
    ▼ Auto-advance after 2.8s or Tap
src/app/onboarding/step-1.tsx
    │  └─ Mounts <OnboardingStep1 /> (Welcome & Mosque illustration)
    │
    ▼ router.push('/onboarding/step-2')
src/app/onboarding/step-2.tsx
    │  └─ Mounts <OnboardingStep2 /> (Feature summary cards)
    │
    ▼ router.push('/language')
src/app/language.tsx
    │  └─ Mounts <LanguageSelectionScreen /> (Interactive language radio list)
    │
    ▼ router.push('/permissions')
src/app/permissions.tsx
    │  └─ Mounts <PermissionsScreen /> (Location, Notifications, Storage checkboxes)
    │
    ▼ router.replace('/(tabs)')
src/app/(tabs)/_layout.tsx (Main Bottom Tab Navigator)
    │
    ├─► /(tabs)/index.tsx    ──► <HomeScreen /> (Hero greeting, next prayer, timetable)
    ├─► /(tabs)/prayer.tsx   ──► <PrayerTimesScreen /> (Detailed Salah timetable)
    ├─► /(tabs)/qibla.tsx    ──► <QiblaScreen /> (Compass dial & Kaaba alignment)
    ├─► /(tabs)/quran.tsx    ──► Placeholder Tab (Holy Qur'an)
    ├─► /(tabs)/hadith.tsx   ──► Placeholder Tab (Hadith collections)
    └─► /(tabs)/more.tsx     ──► Placeholder Tab (Tools & Calendar)
```

---

## 2. Route Directory Specification

| Route Path           | Route File                      | Purpose                      | Navigation Trigger            | Method           | Primary Feature Dependency                                       |
| :------------------- | :------------------------------ | :--------------------------- | :---------------------------- | :--------------- | :--------------------------------------------------------------- |
| `/`                  | `src/app/index.tsx`             | Startup splash branding      | App launch                    | Root Mount       | `src/features/onboarding/components/SplashScreen.tsx`            |
| `/onboarding/step-1` | `src/app/onboarding/step-1.tsx` | Onboarding Step 1 (Welcome)  | Timer (2.8s) or Splash tap    | `router.replace` | `src/features/onboarding/components/OnboardingStep1.tsx`         |
| `/onboarding/step-2` | `src/app/onboarding/step-2.tsx` | Onboarding Step 2 (Features) | "Next" button on Step 1       | `router.push`    | `src/features/onboarding/components/OnboardingStep2.tsx`         |
| `/language`          | `src/app/language.tsx`          | Language Selection           | "Next" button on Step 2       | `router.push`    | `src/features/onboarding/components/LanguageSelectionScreen.tsx` |
| `/permissions`       | `src/app/permissions.tsx`       | Permissions Consent          | "Continue" button on Language | `router.push`    | `src/features/onboarding/components/PermissionsScreen.tsx`       |
| `/(tabs)`            | `src/app/(tabs)/_layout.tsx`    | Tab Navigator Shell          | "Continue" on Permissions     | `router.replace` | Bottom Tab Layout & SVG Tab Icons                                |
| `/(tabs)/`           | `src/app/(tabs)/index.tsx`      | Home Dashboard               | Tab bar "Home" selection      | Tab Switch       | `src/features/home/components/HomeScreen.tsx`                    |
| `/(tabs)/prayer`     | `src/app/(tabs)/prayer.tsx`     | Prayer Times Details         | Tap next prayer card / row    | `router.push`    | `src/features/prayer-times/components/PrayerTimesScreen.tsx`     |
| `/(tabs)/qibla`      | `src/app/(tabs)/qibla.tsx`      | Qibla Compass                | Tab bar "Qibla" or Home icon  | `router.push`    | `src/features/qibla/components/QiblaScreen.tsx`                  |
| `/qibla`             | `src/app/qibla.tsx`             | Standalone Qibla route       | Direct link / Modal           | `router.push`    | `src/features/qibla/components/QiblaScreen.tsx`                  |
| `/(tabs)/quran`      | `src/app/(tabs)/quran.tsx`      | Holy Qur'an placeholder      | Tab bar "Qur'an" selection    | Tab Switch       | Inline tab placeholder                                           |
| `/(tabs)/hadith`     | `src/app/(tabs)/hadith.tsx`     | Hadith placeholder           | Tab bar "Hadith" selection    | Tab Switch       | Inline tab placeholder                                           |
| `/(tabs)/more`       | `src/app/(tabs)/more.tsx`       | More tools placeholder       | Tab bar "More" selection      | Tab Switch       | Inline tab placeholder                                           |

---

## 3. Screen-by-Screen Code Analysis

### 1. Splash Screen

- **Route File:** `src/app/index.tsx`
- **Main Component:** `src/features/onboarding/components/SplashScreen.tsx`
- **Child Components:** `IslamicPatternOverlay`, `SplashGoldenEmblem`, `ThemedText`, `StatusBar`
- **Hooks Used:** `useRouter()`, `useSafeAreaInsets()`
- **State Used:** None (timer-driven transition)
- **Data Source:** Static string labels (`Faith · Worship · Knowledge`)
- **Theme/Styling:** Hardcoded approved primary Deep Forest Green (`#0A3B2A`) container with gold accents (`#E6C875`).
- **Navigation:** `setTimeout` (2800ms) or user tap advances to `/onboarding/step-1` via `router.replace()`.
- **Status:** Complete presentation UI. Future: Check persistence (`AsyncStorage`) to skip onboarding if previously completed.

### 2. Onboarding Step 1

- **Route File:** `src/app/onboarding/step-1.tsx`
- **Main Component:** `src/features/onboarding/components/OnboardingStep1.tsx`
- **Child Components:** `ScreenContainer`, `OnboardingMosqueArt`, `ThemedText`, `PrimaryButton`
- **Hooks Used:** `useRouter()`
- **State Used:** None
- **Data Source:** Static copy (`Welcome`, `Your spiritual journey starts here`)
- **Theme/Styling:** Warm cream background (`#FAF8F2`), slate text, active green pagination dot (1 of 3).
- **Navigation:** "Next" button triggers `router.push('/onboarding/step-2')`.
- **Status:** Complete presentation UI.

### 3. Onboarding Step 2

- **Route File:** `src/app/onboarding/step-2.tsx`
- **Main Component:** `src/features/onboarding/components/OnboardingStep2.tsx`
- **Child Components:** `ScreenContainer`, `ThemedText`, `PrimaryButton`, inline SVG feature icons (`clock`, `book`, `compass`, `hadith`)
- **Hooks Used:** `useRouter()`
- **State Used:** None
- **Data Source:** `MOCK_FEATURES` from `src/features/onboarding/data/onboarding.mock.ts`
- **Theme/Styling:** Feature cards with 16px radius, soft drop shadow, white card background, active pagination dot (2 of 3).
- **Navigation:** "Next" button triggers `router.push('/language')`.
- **Status:** Complete presentation UI.

### 4. Language Selection Screen

- **Route File:** `src/app/language.tsx`
- **Main Component:** `src/features/onboarding/components/LanguageSelectionScreen.tsx`
- **Child Components:** `ScreenContainer`, `ThemedText`, `PrimaryButton`, `ScrollView`, `TouchableOpacity`, SVG checkmark/chevron
- **Hooks Used:** `useRouter()`, `useState()`
- **State Used:** `selectedLanguage` (`LanguageOption`, defaulted to English)
- **Data Source:** `MOCK_LANGUAGES` from `src/features/onboarding/data/onboarding.mock.ts` (English, Arabic, Urdu, Bangla, Turkish, Persian, Indonesian)
- **Theme/Styling:** Grouped card list with dividers; selected item highlighted with light emerald tint (`#ECFDF5`) and green checkmark.
- **Navigation:** "Continue" button triggers `router.push('/permissions')`.
- **Status:** Interactive UI state. Future: Connect to `i18n-js` / `react-i18next` and save choice to persistent storage.

### 5. Permissions Screen

- **Route File:** `src/app/permissions.tsx`
- **Main Component:** `src/features/onboarding/components/PermissionsScreen.tsx`
- **Child Components:** `ScreenContainer`, `ThemedText`, `PrimaryButton`, `TouchableOpacity`, SVG icons
- **Hooks Used:** `useRouter()`, `useState()`
- **State Used:** `permissionsState` (`Record<string, boolean>` for `location`, `notifications`, `storage`)
- **Data Source:** `MOCK_PERMISSIONS` from `src/features/onboarding/data/onboarding.mock.ts`
- **Theme/Styling:** Permission cards with custom animated/toggleable checkbox components.
- **Navigation:** "Continue" button triggers `router.replace('/(tabs)')`.
- **Status:** Interactive UI state. Future: Connect to native permission dialogs via `expo-location` and `expo-notifications`.

### 6. Home Screen

- **Route File:** `src/app/(tabs)/index.tsx`
- **Main Component:** `src/features/home/components/HomeScreen.tsx`
- **Child Components:** `IslamicPatternOverlay`, `ThemedText`, `StatusBar`, `ScrollView`, `TouchableOpacity`, SVG icons
- **Hooks Used:** `useRouter()`, `useSafeAreaInsets()`, `useState()`, `useEffect()`
- **State Used:** `countdown` object (`{ h: 1, m: 24, s: 35 }`) running on a 1-second `setInterval` interval.
- **Data Source:** `MOCK_HOME_DASHBOARD` from `src/features/home/data/home.mock.ts`
- **Theme/Styling:** Deep Forest Green hero upper half (`#0A3B2A`) with Next Prayer spotlight card and Warm Cream bottom sheet (`#FAF8F2`) with daily timetable.
- **Navigation:** Top right compass icon routes to `/(tabs)/qibla`; tapping Next Prayer or timetable rows routes to `/(tabs)/prayer`.
- **Status:** Complete UI with live ticking countdown timer. Future: Replace mock data with GPS-based calculation engine or remote prayer API.

### 7. Prayer Times Screen

- **Route File:** `src/app/(tabs)/prayer.tsx`
- **Main Component:** `src/features/prayer-times/components/PrayerTimesScreen.tsx`
- **Child Components:** `ScreenContainer`, `ThemedText`, `PrimaryButton`, `ScrollView`, `TouchableOpacity`, SVG icons
- **Hooks Used:** `useRouter()`
- **State Used:** None
- **Data Source:** `MOCK_PRAYER_TIMES_SCREEN` from `src/features/prayer-times/data/prayer-times.mock.ts`
- **Theme/Styling:** Header bar with back/qibla actions, date/location metadata, 5-prayer timetable card with active prayer highlighted in forest green (`#0A3B2A`), calculation method & madhab summary card, and "Monthly Timetable" button.
- **Navigation:** Back button triggers `router.back()`, top right compass icon triggers `router.push('/(tabs)/qibla')`.
- **Status:** Complete presentation UI. Future: Real-time calculation via `@adhan/adhan` or API, notification scheduling, and calculation method picker modal.

### 8. Qibla Screen

- **Route File:** `src/app/(tabs)/qibla.tsx` and `src/app/qibla.tsx`
- **Main Component:** `src/features/qibla/components/QiblaScreen.tsx`
- **Child Components:** `ScreenContainer`, `ThemedText`, `CompassDial`, `QiblaInfoCard`, `ScrollView`, `TouchableOpacity`, SVG icons
- **Hooks Used:** `useRouter()`, `useState()`
- **State Used:** `heading` (`number`, defaulted to `293`, toggles to `305` on test refresh)
- **Data Source:** `MOCK_QIBLA_SCREEN` from `src/features/qibla/data/qibla.mock.ts`
- **Theme/Styling:** 360-degree compass dial with 36 tick marks, cardinal indicators (`N`, `S`, `E`, `W`), rotating needle assembly with center 3D Isometric Kaaba emblem, and location card.
- **Navigation:** Header back icon triggers `router.back()`. Top right refresh button and card refresh button toggle mock heading for interactive visual verification.
- **Status:** Complete interactive UI. Future: Subscribe to device magnetometer sensor via `expo-sensors` (`Magnetometer.addListener`) and calculate true bearing from GPS coordinates.

---

## 4. Data Flow Architecture

```text
SOURCE                         TRANSFORMATION                        CONSUMER
──────────────────────────────────────────────────────────────────────────────────
onboarding.mock.ts        ──► Component Mapping                 ──► OnboardingStep2 (Features List)
onboarding.mock.ts        ──► useState (selectedLanguage)       ──► LanguageSelectionScreen
onboarding.mock.ts        ──► useState (permissionsState)       ──► PermissionsScreen
home.mock.ts              ──► Component Props + 1s Timer        ──► HomeScreen (Hero + Timetable)
prayer-times.mock.ts      ──► Timetable Mapping                 ──► PrayerTimesScreen
qibla.mock.ts             ──► useState (heading) + Dial Math    ──► QiblaScreen & CompassDial
theme tokens & themes     ──► ThemeProvider / useTheme()        ──► ScreenContainer & ThemedText
useSafeAreaInsets()       ──► Inset arithmetic                 ──► ScreenContainer & Hero padding
```

> [!NOTE]
> All domain data sources (prayers, coordinates, countdown times, languages, permissions) are currently **mock/static fixtures**. No remote backend or native sensor integration is active in this milestone.

---

## 5. Design Token & Theme Engine

The application features a centralized design system located in `src/theme/`:

1. **Tokens (`src/theme/tokens/`):**
   - `colors.ts`: Raw palette (`forestGreen`, `gold`, `cream`, `slate`, `red`, `amber`, `blue`).
   - `typography.ts`: Sizes (`xs: 12` to `huge: 40`), line heights, font weights (`400`, `500`, `600`, `700`).
   - `spacing.ts`: Spacing scale (`none: 0` to `xxxl: 48`).
   - `radii.ts`: Corner radii scale (`none: 0` to `full: 9999`).

2. **Themes (`src/theme/themes/`):**
   - `light.ts`: Semantic colors mapped for day mode (Cream `#FAF8F2` background, slate text, forest green brand).
   - `dark.ts`: Semantic colors mapped for night mode (Slate `#0B0F19` background, light slate text, emerald brand).

3. **Provider & Hook (`src/theme/ThemeProvider.tsx` & `useTheme.ts`):**
   - Synchronizes automatically with device color scheme via `useColorScheme()`.
   - Exposes `{ theme, isDark, mode, setMode }` to any React Native component.

---

## 6. Architecture Diagrams

### A. Modular Feature Architecture

```text
src/
├── app/                  <── Navigation Routing Layer (Expo Router)
│    └── (routes mount features)
│
├── features/             <── Domain Feature Layer (Self-contained)
│    ├── home/
│    ├── onboarding/
│    ├── prayer-times/
│    └── qibla/
│         ├── components/
│         ├── data/
│         ├── types/
│         └── index.ts
│
├── components/           <── Shared Presentation Layer (Domain-Agnostic)
│    ├── layout/ (ScreenContainer)
│    ├── typography/ (ThemedText)
│    ├── ui/ (PrimaryButton)
│    └── illustrations/ (SVG Art)
│
└── theme/                <── Design Token Engine
     ├── tokens/ (Colors, Typography, Spacing, Radii)
     └── themes/ (Light, Dark)
```

### B. Future API & Sensor Integration Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    React Native UI Layer                    │
│   (HomeScreen, PrayerTimesScreen, QiblaScreen, Onboarding)  │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
       Custom Domain Hooks             Custom Domain Hooks
       (usePrayerTimes, useLocation)   (useQiblaHeading, useCompass)
               │                               │
┌──────────────▼──────────────┐ ┌──────────────▼──────────────┐
│       Services / API        │ │    Native Sensor Drivers    │
│  - Aladhan / Local Math     │ │  - expo-location (GPS)      │
│  - Remote Islamic Cloud     │ │  - expo-sensors (Compass)   │
│  - Offline Cache (MMKV)     │ │  - expo-notifications       │
└─────────────────────────────┘ └─────────────────────────────┘
```
