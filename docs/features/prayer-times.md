# Prayer Times Feature Documentation

**Module:** `src/features/prayer-times`  
**Current Milestone:** UI Presentation Only (Static Mock Data)

---

## 1. Feature Overview

The Prayer Times module presents the daily Salah timetable, weekly day carousel, next upcoming prayer highlight, and individual notification bell toggles.

---

## 2. Directory Structure

```
src/features/prayer-times/
├── components/
│   └── PrayerTimesScreen.tsx    # Timetable layout, weekly strip, prayer cards
├── data/
│   └── prayer-times.mock.ts     # Mock 5-daily Salah schedule & calendar days
├── types/
│   └── prayer-times.types.ts    # PrayerItem, DayTab, PrayerScheduleMock
└── index.ts                     # Public module export barrier
```

---

## 3. UI Components & Visual Elements

- **Header:** Location metadata (`London, United Kingdom`) and Hijri calendar date.
- **Weekly Day Strip:** Horizontal carousel displaying days of the current week with the active day selected.
- **Upcoming Salah Banner:** Emerald hero card showing next prayer (`Asr`) and time to Adhan.
- **5-Daily Prayer Schedule:** Timetable covering Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha with status indicators (Passed, Next, Upcoming) and interactive notification bell icons.
- **Calculation Rule Banner:** Explaining the calculation standard used (`London Unified Islamic Timetable`).
