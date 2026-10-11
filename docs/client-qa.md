# Client Questions — Ready Answers: Islamic Companion

This document provides factual, definitive answers for client discussions and stakeholder reviews based strictly on the current codebase.

---

### 1. What technology is the app built with?

The app is built with **React Native (0.86.3)**, **Expo SDK 57** (with the React Native New Architecture enabled by default), **TypeScript** (Strict Mode), and **Expo Router v4** (file-based navigation).

### 2. Is it Android only or both Android and iOS?

The codebase is **100% cross-platform** and supports both **Android and iOS**. Native project generation is handled automatically via Continuous Native Generation (CNG) through `app.json`.

### 3. Is the app currently connected to a backend?

**No.** The current milestone is focused strictly on the approved UI/UX design, typography, layout hierarchy, and navigation flow. All data is served from local mock fixtures (`.mock.ts` files).

### 4. Are prayer times real or mock?

**Currently mock.** The prayer times shown (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) are static fixtures located in `src/features/prayer-times/data/prayer-times.mock.ts` and `src/features/home/data/home.mock.ts`.

### 5. Is Qibla direction real?

**Currently mock UI.** The compass displays a static default angle of $293^\circ$ (North West) pointing toward an isometric representation of the Holy Kaaba. It contains a manual test button that toggles the heading between $293^\circ$ and $305^\circ$ for UI demonstration.

### 6. Does Qibla use device compass?

**Not yet.** Physical compass integration via device magnetometer hardware (`expo-sensors`) is planned for the native sensor milestone.

### 7. Does the app use GPS?

**Not yet.** Current city and coordinates (`New Delhi, India`, `28.6139° N, 77.2090° E`) are mock values. Real GPS acquisition via `expo-location` will be integrated in the location milestone.

### 8. Are notifications implemented?

**Not yet.** The prayer notification bells and permissions checkboxes toggle local component state only. Actual OS-level background notifications via `expo-notifications` are scheduled for a future milestone.

### 9. Is authentication implemented?

**No.** The current milestone does not include user registration, login, or cloud accounts.

### 10. Is Quran implemented?

**UI tab placeholder only.** The Qur'an tab (`src/app/(tabs)/quran.tsx`) displays an elegant placeholder introducing the Holy Qur'an feature. Complete Surah/Ayah audio and text rendering will be added in the Qur'an milestone.

### 11. Is Hadith implemented?

**UI tab placeholder only.** The Hadith tab (`src/app/(tabs)/hadith.tsx`) displays an authentic collection placeholder introducing Sahih Bukhari, Muslim, and other books.

### 12. Can languages actually change the app language?

**Interactive selection only.** The Language Selection screen allows selecting different languages (English, Arabic, Urdu, Bangla, Turkish, Persian, Indonesian) in component state, but internationalization strings (`i18n`) and RTL layout flipping are planned for the localization milestone.

### 13. Are permissions actually requested from the device?

**UI checkboxes only.** The Permissions screen allows the user to review and toggle consent visually, but does not invoke native Android/iOS permission dialogs yet.

### 14. What is implemented in this milestone?

- Full 8-screen application startup and navigation flow:
  1. Splash Screen with auto-transition timer
  2. Onboarding Step 1 (Welcome & Mosque artwork)
  3. Onboarding Step 2 (Feature list cards)
  4. Language Selection Screen (interactive list)
  5. Permissions Screen (interactive checkboxes)
  6. Home Screen Dashboard (hero card, countdown timer, prayer timetable)
  7. Prayer Times Screen (schedule, calculation method, monthly timetable button)
  8. Qibla Finder (360° cardinal compass dial, Kaaba indicator, degree readout)
- Bottom Tab Navigator with custom SVG tab icons.
- Centralized Design Token System (Light & Dark themes, Islamic Green palette, Gold accents, Warm Cream backgrounds).
- Clean, modular domain architecture with strict TypeScript typing.
- EAS Build configuration generating installable Android APKs.

### 15. What is future scope?

- GPS geolocation (`expo-location`)
- Compass magnetometer sensor (`expo-sensors`)
- Astronomical calculation engine (Aladhan API or `@adhan/adhan` mathematical formulas)
- Local push notifications & Adhan alarms (`expo-notifications`)
- Full Qur'an reader with Arabic calligraphy, audio recitations, and translations
- Hadith library with search and bookmarks
- Hijri calendar tools, Tasbeeh digital counter, and Qaza prayer tracker
- User authentication & cross-device cloud synchronization
- Multi-language localization with RTL support

### 16. How is navigation structured?

The navigation is powered by **Expo Router**, using a root Stack navigator (`src/app/_layout.tsx`) that mounts onboarding steps sequentially and transitions to a persistent Bottom Tab Navigator (`src/app/(tabs)/_layout.tsx`).

### 17. How is the theme system structured?

A 2-tier design token engine located in `src/theme/`. Primitives (palette, typography, spacing, radii) are assembled into semantic themes (`lightTheme` and `darkTheme`), injected via `ThemeProvider`, and consumed with the `useTheme()` hook.

### 18. How will APIs be integrated later?

API services will be added inside `src/features/<feature>/services/` or `src/services/` using standard HTTP clients (e.g., `axios` or native `fetch`) and encapsulated via custom React hooks (e.g., `usePrayerTimes()`).

### 19. How will authentication be added later?

An `auth` domain module (`src/features/auth`) will be introduced with state persistence (e.g., SecureStore/MMKV) and an authentication route group `(auth)` within Expo Router.

### 20. How will the app scale when more features are added?

The **Domain-Driven Feature Layer** architecture allows adding new features (such as `src/features/quran/` or `src/features/tasbeeh/`) without touching existing modules. Each feature remains completely self-contained with its own components, types, and data.

### 21. How is the APK generated?

Via **Expo Application Services (EAS Build)** using the `preview` profile defined in `eas.json` (`"buildType": "apk"`). The cloud builder compiles the React Native Android project and produces a standalone `.apk` installable on any physical Android device.

### 22. What is needed for Play Store release?

1. Google Play Developer Account ($25 one-time registration).
2. Android Keystore (generated and managed securely by EAS).
3. Production build generation (`eas build --platform android --profile production` generating an `.aab` Android App Bundle).
4. Store listing assets (screenshots, icon, feature graphic, privacy policy URL).
