# Implemented vs. Future Feature Matrix & Technical Risks

This document details the current milestone implementation status versus future scope, native API readiness, mock data fixtures, and technical risk considerations for the Islamic Companion project.

---

## 1. Feature Implementation Matrix

| Feature / Screen              | Current Status         | Current Implementation                                                                                                                                                                                                                | Future Requirement                                                                                                             |
| :---------------------------- | :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------- |
| **01. Splash Screen**         | **IMPLEMENTED**        | Auto-transition timer (2.8s) + tap advance, Islamic Girih background, golden emblem, brand typography.                                                                                                                                | Check persistence (`AsyncStorage`/MMKV) to bypass onboarding if already completed.                                             |
| **02. Onboarding Step 1**     | **IMPLEMENTED**        | Layered vector mosque artwork, spiritual welcome copy, pagination indicator (1 of 3), Next button.                                                                                                                                    | Track onboarding analytics and skip logic.                                                                                     |
| **03. Onboarding Step 2**     | **IMPLEMENTED**        | 4 feature cards (Prayer Times, Qur'an, Qibla, Hadith), pagination (2 of 3), Next button.                                                                                                                                              | Dynamic feature list from remote config if needed.                                                                             |
| **04. Language Selection**    | **IMPLEMENTED**        | Interactive radio selection list (7 languages: English, Arabic, Urdu, Bangla, Turkish, Persian, Indonesian).                                                                                                                          | `i18n` localization engine, string translation files, RTL layout support for Arabic/Urdu/Persian.                              |
| **05. Permissions Screen**    | **IMPLEMENTED**        | Consent cards (`PermissionCard`) with live `expo-location` request handler, toggle state for Notifications and Storage.                                                                                                               | Hook up native push notification permission registration via `expo-notifications`.                                             |
| **06. Home Dashboard**        | **IMPLEMENTED**        | User greeting bar, location display (live GPS or fallback), Next Prayer hero card with live 1s countdown timer, daily prayer timetable sheet, and Tasbeeh quick-access shortcut.                                                      | Live astronomical calculation engine, live Adhan audio triggers, daily Hadith feed.                                            |
| **07. Prayer Times**          | **IMPLEMENTED**        | Date banner, location header, full 5-salah timetable with active Asr highlight, calculation method/madhab card, and "Monthly Timetable" shortcut to Calendar.                                                                         | Offline calculation formula (`@adhan/adhan`), calculation method picker modal, Adhan audio notifications.                      |
| **08. Qibla Finder**          | **IMPLEMENTED**        | 360° compass dial (`CompassDialFace`, `CompassNeedle`), live heading subscription (`useDeviceHeading`), Qibla bearing calculation (`qibla-geometry`), haptic alignment pulses (`qibla-haptics`), and location card (`QiblaInfoCard`). | Low-pass filter smoothing for noisy magnetometer hardware, physical device validation across different Android/iOS OEMs.       |
| **09. Islamic Calendar**      | **IMPLEMENTED**        | Full month navigator with year rollover, 7-column weekday grid (`CalendarMonthGrid`, `CalendarDayCell`), selected date card with Friday (Jumu'ah) badge, and upcoming Islamic occasions list.                                         | Verified astronomical lunar calendar engine (`moment-hijri` or Umm al-Qura API) replacing current illustrative approximations. |
| **10. Digital Tasbeeh**       | **IMPLEMENTED**        | Interactive circular counter dial (`TasbeehCounterDial`), Dhikr switcher (`SelectedDhikrCard`), target goal selector (33, 99, 100, 1000), round tracker, undo and reset controls (`TasbeehControlsRow`).                              | Sound/haptic feedback on bead click, custom dhikr creation, persistence of daily dhikr counts across sessions.                 |
| **Bottom Tab Navigation**     | **IMPLEMENTED**        | 5-tab bar with themed SVGs: Home, Qur'an, Qibla, Hadith, More (mounting Tasbeeh and Calendar via segmented tab switcher).                                                                                                             | Deep linking, active badge counts.                                                                                             |
| **Holy Qur'an**               | **UI TAB PLACEHOLDER** | Static informational placeholder tab.                                                                                                                                                                                                 | Complete Surah list, Ayah reciter audio player, Arabic script renderer, translations, bookmarks.                               |
| **Hadith Collections**        | **UI TAB PLACEHOLDER** | Static informational placeholder tab.                                                                                                                                                                                                 | Sahih Bukhari, Sahih Muslim collections, search engine, favorites.                                                             |
| **Theme System**              | **IMPLEMENTED**        | Light and Dark semantic themes, centralized token palettes, `ThemeProvider` with auto system-scheme detection, and dark-mode tokens for all screens.                                                                                  | User manual theme toggle switch (Light / Dark / System) in app settings.                                                       |
| **Authentication & Accounts** | **FUTURE SCOPE**       | Not implemented.                                                                                                                                                                                                                      | Firebase Auth / Supabase / Custom JWT authentication, cloud profile sync.                                                      |
| **Push Notifications**        | **HONEST ALERT STUB**  | Home notification button and permissions screen toggle display informative native dialog.                                                                                                                                             | `expo-notifications`, scheduled local daily Adhan alarms, background task triggers.                                            |
| **Backend & Sync**            | **FUTURE SCOPE**       | Local mock fixtures only.                                                                                                                                                                                                             | REST / GraphQL API, offline cache, cloud bookmarks.                                                                            |

---

## 2. Native & Expo API Readiness Audit

| API / Feature                      | Status              | Notes / Current Code Usage                                                                                                     |
| :--------------------------------- | :------------------ | :----------------------------------------------------------------------------------------------------------------------------- |
| **Expo Router**                    | **IMPLEMENTED**     | File-based navigation throughout `src/app/`, supporting stack and tab layouts.                                                 |
| **expo-splash-screen**             | **IMPLEMENTED**     | Controlled prevent/hide splash lifecycle in `src/app/_layout.tsx`.                                                             |
| **react-native-safe-area-context** | **IMPLEMENTED**     | Inset handling via `ScreenContainer.tsx` and custom headers.                                                                   |
| **expo-status-bar**                | **IMPLEMENTED**     | Dark/Light dynamic status bar across all screens.                                                                              |
| **react-native-svg**               | **IMPLEMENTED**     | Used across all icons, compass dial, and vector illustrations.                                                                 |
| **expo-location (GPS & Heading)**  | **IMPLEMENTED**     | GPS coordinates & reverse geocoding via `LocationContext`; magnetometer heading via `watchHeadingAsync` in `useDeviceHeading`. |
| **expo-haptics**                   | **IMPLEMENTED**     | Qibla alignment feedback in `qibla-haptics.ts` with duplicate suppression and cooldown window.                                 |
| **expo-notifications**             | **NOT IMPLEMENTED** | Required for scheduling 5 daily Adhan notifications. Notification UI displays honest native alert.                             |
| **AsyncStorage / MMKV**            | **NOT IMPLEMENTED** | Required for persisting language selection, onboarding status, and settings.                                                   |

---

## 3. Mock Data vs. Future Implementation

```text
MOCK FIXTURE                    CURRENT USAGE                  FUTURE REPLACEMENT
───────────────────────────────────────────────────────────────────────────────────────
onboarding.mock.ts (Languages)   Language Selection screen      i18n localization dictionary + storage
onboarding.mock.ts (Permissions) Permissions screen             expo-location & expo-notifications status
home.mock.ts (Dashboard)         Home screen hero & timetable   Calculated prayer times + GPS reverse geocode
prayer-times.mock.ts (Schedule)  Prayer Times screen            @adhan/adhan astronomical engine or API
qibla.mock.ts (Bearing)          Qibla screen fallback coords   GPS location from LocationContext
calendar.mock.ts (Calendar)      Calendar & Islamic events      Umm al-Qura astronomical lunar calculator
tasbeeh.mock.ts (Dhikr items)    Tasbeeh screen dhikr options   Local storage / custom user dhikr list
```

---

## 4. Key Technical Considerations & Risks for Future Milestones

1. **Magnetometer Calibration & Physical Device Validation:**
   - Real-world mobile compass sensors vary significantly across Android and iOS hardware. Hardware magnetometer readings can exhibit magnetic noise and drift.
   - The figure-8 calibration gesture reminder is in place (`QiblaStatusBanner`), but physical device testing across varied OEM devices is mandatory before production release.

2. **Accurate Astronomical Prayer Calculations:**
   - High-latitude regions (e.g., Scandinavia, UK) experience midnight sun or twilight persistence in summer. An astronomical engine like `@adhan/adhan` is needed to replace static timetable mock data.
   - Hanafi vs. Shafi'i Asr calculation must be dynamically configurable by the user.

3. **Background Notification Reliability (Android & iOS):**
   - Android aggressive battery management (Doze Mode, vendor battery optimizers) can delay or suppress scheduled alarms. Exact alarm permissions (`SCHEDULE_EXACT_ALARM`) may be required on Android 12+.
   - iOS imposes limits on local notification rescheduling (maximum 64 scheduled notifications). A rolling schedule worker is needed.

4. **Right-to-Left (RTL) Layout Support:**
   - When Arabic, Urdu, or Persian languages are activated, React Native's `I18nManager.forceRTL(true)` must be supported without breaking vector coordinate math on the Qibla compass dial.

5. **Lunar Sighting Governance:**
   - Islamic dates shown in the Calendar are illustrative approximations. Authoritative religious dates depend on verified local lunar sightings; the UI disclaimer clearly informs users of this.
