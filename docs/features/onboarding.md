# Onboarding Feature Documentation

**Module:** `src/features/onboarding`  
**Current Milestone:** UI Presentation Only (Static Mock Data)

---

## 1. Feature Overview

The Onboarding module provides the complete initial user onboarding experience:

1. **Screen 01 — Splash:** Brand presentation with emblem, app name, and tagline.
2. **Screen 02 — Onboarding Step 1:** Highlight of verified Prayer Times & Adhan alerts.
3. **Screen 03 — Onboarding Step 2:** Highlight of Qibla compass & spiritual utilities.
4. **Screen 04 — Language Selection:** Interactive language picker (English, Arabic, Indonesian, Urdu, Turkish, French).
5. **Screen 05 — Permissions:** Explanation and toggle UI for Location, Notifications, and Storage permissions.

---

## 2. Directory Structure

```
src/features/onboarding/
├── components/
│   ├── SplashScreen.tsx             # Entry splash branding
│   ├── OnboardingStep1.tsx          # Step 1 prayer times presentation
│   ├── OnboardingStep2.tsx          # Step 2 Qibla compass presentation
│   ├── LanguageSelectionScreen.tsx  # Language list & selection UI
│   └── PermissionsScreen.tsx        # Permissions explanation & switches
├── data/
│   └── onboarding.mock.ts           # Mock languages and permission lists
├── types/
│   └── onboarding.types.ts          # LanguageOption & PermissionItem types
└── index.ts                         # Public module export barrier
```
