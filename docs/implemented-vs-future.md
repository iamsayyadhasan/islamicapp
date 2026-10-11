# Implemented vs. Future Feature Matrix & Technical Risks

This document details the current milestone implementation status versus future scope, native API readiness, mock data fixtures, and technical risk considerations.

---

## 1. Feature Implementation Matrix

| Feature / Screen              | Current Milestone Status | Current Implementation                                                                                                     | Future Functional Requirement                                                                             |
| :---------------------------- | :----------------------- | :------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| **01. Splash Screen**         | **IMPLEMENTED**          | Auto-transition timer (2.8s) + tap advance, Islamic Girih background, golden emblem, brand typography.                     | Check persistence (`AsyncStorage`/MMKV) to bypass onboarding if already completed.                        |
| **02. Onboarding Step 1**     | **IMPLEMENTED**          | Layered vector mosque artwork, spiritual welcome copy, pagination indicator (1 of 3), Next button.                         | Track onboarding analytics and skip logic.                                                                |
| **03. Onboarding Step 2**     | **IMPLEMENTED**          | 4 feature cards (Prayer Times, Qur'an, Qibla, Hadith), pagination (2 of 3), Next button.                                   | Dynamic feature list from remote config if needed.                                                        |
| **04. Language Selection**    | **IMPLEMENTED**          | Interactive radio selection list (7 languages: English, Arabic, Urdu, Bangla, Turkish, Persian, Indonesian).               | `i18n` localization engine, string translation files, RTL layout support for Arabic/Urdu/Persian.         |
| **05. Permissions Screen**    | **IMPLEMENTED**          | Consent cards with interactive toggle checkboxes for Location, Notifications, and Storage.                                 | Invoke native OS permission dialogs (`expo-location`, `expo-notifications`).                              |
| **06. Home Dashboard**        | **IMPLEMENTED**          | User greeting, location bar, Next Prayer hero spotlight with live 1s countdown timer, daily prayer timetable sheet.        | Live GPS location, astronomical calculation engine, live Adhan alert triggers, daily Hadith feed.         |
| **07. Prayer Times**          | **IMPLEMENTED**          | Date banner, location header, full 5-salah timetable with active Asr highlight, calculation method/madhab card.            | Offline calculation formula (`@adhan/adhan`), calculation method picker modal, Adhan audio notifications. |
| **08. Qibla Finder**          | **IMPLEMENTED**          | 360° cardinal compass dial, degree readout ($293^\circ$), rotating needle assembly with isometric 3D Kaaba, location card. | Connect to device magnetometer (`expo-sensors`), GPS bearing calculation, haptic alignment feedback.      |
| **Bottom Tab Navigation**     | **IMPLEMENTED**          | 5-tab bar with custom SVGs: Home, Qur'an, Qibla, Hadith, More.                                                             | Deep linking, active badge counts.                                                                        |
| **Holy Qur'an**               | **UI TAB PLACEHOLDER**   | Static informational placeholder tab.                                                                                      | Complete Surah list, Ayah reciter audio player, Arabic script renderer, translations, bookmarks.          |
| **Hadith Collections**        | **UI TAB PLACEHOLDER**   | Static informational placeholder tab.                                                                                      | Sahih Bukhari, Sahih Muslim collections, search engine, favorites.                                        |
| **More Tools & Calendar**     | **UI TAB PLACEHOLDER**   | Static informational placeholder tab.                                                                                      | Hijri calendar converter, Tasbeeh digital counter, Qaza tracker, app settings.                            |
| **Theme System**              | **IMPLEMENTED**          | Light and Dark semantic themes, centralized token palettes, `ThemeProvider` with auto system-scheme detection.             | User theme override switch (Light / Dark / System).                                                       |
| **Authentication & Accounts** | **FUTURE SCOPE**         | Not implemented.                                                                                                           | Firebase Auth / Supabase / Custom JWT authentication, cloud profile sync.                                 |
| **Push Notifications**        | **FUTURE SCOPE**         | UI checkboxes only.                                                                                                        | `expo-notifications`, scheduled local daily Adhan alarms, background task triggers.                       |
| **Backend & Sync**            | **FUTURE SCOPE**         | Local mock fixtures only.                                                                                                  | REST / GraphQL API, offline cache, cloud bookmarks.                                                       |

---

## 2. Native & Expo API Readiness Audit

| API / Feature                      | Status              | Notes / Current Code Usage                                                   |
| :--------------------------------- | :------------------ | :--------------------------------------------------------------------------- |
| **Expo Router**                    | **IMPLEMENTED**     | File-based navigation throughout `src/app/`.                                 |
| **expo-splash-screen**             | **IMPLEMENTED**     | Controlled prevent/hide splash lifecycle in `src/app/_layout.tsx`.           |
| **react-native-safe-area-context** | **IMPLEMENTED**     | Inset handling via `ScreenContainer.tsx` and `HomeScreen.tsx`.               |
| **expo-status-bar**                | **IMPLEMENTED**     | Dark/Light dynamic status bar across screens.                                |
| **react-native-svg**               | **IMPLEMENTED**     | Used across all icons, compass dial, and vector illustrations.               |
| **expo-sensors (Magnetometer)**    | **NOT IMPLEMENTED** | Required for physical compass hardware rotation in Qibla module.             |
| **expo-location (GPS)**            | **NOT IMPLEMENTED** | Required for automated latitude/longitude discovery.                         |
| **expo-notifications**             | **NOT IMPLEMENTED** | Required for scheduling 5 daily Adhan notifications.                         |
| **expo-haptics**                   | **NOT IMPLEMENTED** | Optional enhancement for compass alignment vibration.                        |
| **AsyncStorage / MMKV**            | **NOT IMPLEMENTED** | Required for persisting language selection, onboarding status, and settings. |

---

## 3. Mock Data vs. Future Implementation

```text
MOCK FIXTURE                    CURRENT USAGE                  FUTURE REPLACEMENT
───────────────────────────────────────────────────────────────────────────────────────
onboarding.mock.ts (Languages)   Language Selection screen      i18n localization dictionary + storage
onboarding.mock.ts (Permissions) Permissions screen             expo-location & expo-notifications status
home.mock.ts (Dashboard)         Home screen hero & timetable   Calculated prayer times + GPS reverse geocode
prayer-times.mock.ts (Schedule)  Prayer Times screen            @adhan/adhan astronomical engine or API
qibla.mock.ts (Bearing)          Qibla screen angle & coords    expo-sensors Magnetometer + Great Circle math
```

---

## 4. Key Technical Considerations & Risks for Future Milestones

1. **Magnetometer Calibration & Sensor Noise:**
   - Real-world mobile compass sensors require low-pass filtering / smoothing algorithms (e.g., Exponential Moving Average) to prevent erratic jitter when rotating the compass dial.
   - Magnetic interference detection and calibration prompts ("Figure-8 gesture") must be handled gracefully.

2. **Accurate Astronomical Prayer Calculations:**
   - High-latitude regions (e.g., Scandinavia, UK) experience midnight sun or twilight persistence in summer. The calculation engine must support standard adjustments (e.g., Angle-based, One-seventh rule).
   - Hanafi vs. Shafi'i Asr calculation must be dynamically configurable by the user.

3. **Background Notification Reliability (Android & iOS):**
   - Android aggressive battery management (Doze Mode, vendor battery optimizers) can delay or suppress scheduled alarms. Exact alarm permissions (`SCHEDULE_EXACT_ALARM`) may be required on Android 12+.
   - iOS imposes limits on local notification rescheduling (maximum 64 scheduled notifications). A rolling schedule worker is needed.

4. **Right-to-Left (RTL) Layout Support:**
   - When Arabic, Urdu, or Persian languages are activated, React Native's `I18nManager.forceRTL(true)` must be supported without breaking vector coordinate math on the Qibla compass dial.

5. **Offline Operation:**
   - The app must calculate prayer times and Qibla bearing completely offline using stored GPS coordinates without relying on internet connectivity.
