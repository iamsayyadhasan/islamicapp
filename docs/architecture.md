# Architecture Guide: Islamic Companion

**Application:** Islamic Companion (Mobile App for iOS and Android)  
**Technology Stack:** React Native (0.86.3) + Expo SDK 57 (New Architecture enabled) + TypeScript + Expo Router  
**Current Milestone:** Application Startup Flow & UI Modules (UI Development Only)

---

## 1. Architectural Philosophy

Islamic Companion is built on a **Domain-Driven Modular Architecture** tailored for React Native and Expo Router. The core design principles are:

1. **Strict UI vs. Business Logic Decoupling:** Components are responsible for layout, theming, and rendering. Calculation, sensors, and remote operations reside in dedicated hooks/data layers.
2. **Feature Encapsulation:** All domain-specific code (e.g. Onboarding, Home, Prayer Times, Qibla) is housed inside `src/features/<feature>/` with a clear public export barrier (`index.ts`).
3. **Thin Navigation Routes:** Route files in `src/app/` act purely as mount points and parameter resolvers; they do not contain complex styles or business logic.
4. **Centralized Design Token System:** All UI styling is driven by semantic design tokens in `src/theme/`, preventing magic values and enabling seamless multi-theme support.
5. **No Premature Abstractions:** Architectural layers (services, API clients, stores) are only created when the corresponding feature functionality is being actively implemented.

---

## 2. Complete Application Navigation Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 01. Splash Screen (src/app/index.tsx)                       │
│     Islamic Companion Branding • Auto-transition or Tap     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 02. Onboarding Step 1 (src/app/onboarding/step-1.tsx)       │
│     Accurate Prayer Times • Skip or Next                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 03. Onboarding Step 2 (src/app/onboarding/step-2.tsx)       │
│     Qibla Compass & Spiritual Tools • Continue              │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 04. Language Selection (src/app/language.tsx)               │
│     English, Arabic, Indonesian, Urdu, Turkish, French      │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 05. Permissions Screen (src/app/permissions.tsx)            │
│     Location, Notifications, Storage • Allow & Continue     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ Main Application Tab Navigator (src/app/(tabs)/)            │
│ ├── 06. Home (src/app/(tabs)/index.tsx)                     │
│ ├── 07. Prayer Times (src/app/(tabs)/prayer.tsx)            │
│ └── 08. Qibla Finder (src/app/(tabs)/qibla.tsx)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Implemented vs. Intentionally Deferred Architecture

### ✅ Currently Implemented (UI Milestone)

- **Application Startup Flow:** Complete entry sequence: Splash → Onboarding 1 → Onboarding 2 → Language Selection → Permissions → Main Tabs.
- **Main App Dashboard (Home):** Islamic greeting, date strip, Next Prayer spotlight card, quick access tools grid, Qibla compass link card, and Daily Ayah.
- **Prayer Times UI:** Weekly day selector strip, upcoming prayer highlight banner, full 5-prayer timetable with Arabic calligraphy, passed/active status, and notification bell toggles.
- **Qibla Feature UI (Preserved):** 360° cardinal dial, rotating needle, Kaaba direction marker, alignment glow, and mock location switcher.
- **Theme Foundation:** Primitive color, spacing, typography, and radii tokens; Light and Dark semantic themes; `ThemeProvider` with automatic system color-scheme detection.
- **Shared UI Primitives:** `ScreenContainer` (safe area management + background fill), `ThemedText` (typography variants + token colors).

### ⏸ Intentionally Deferred (Future Milestones)

- **Native Device Sensors:** Compass magnetometer (`expo-sensors`) and GPS geolocation (`expo-location`).
- **Mathematical Engines:** Great Circle Qibla bearing formulas and astronomical prayer calculation algorithms.
- **Native Permissions Engine:** Direct operating system permission dialog bindings.
- **API & Network Services:** Remote prayer time synchronization and API clients.
- **Persistent Storage:** `AsyncStorage`/MMKV for storing completed onboarding status or language selection across app restarts.
