# Home Feature Documentation

**Module:** `src/features/home`  
**Current Milestone:** UI Presentation Only (Static Mock Data)

---

## 1. Feature Overview

The Home dashboard serves as the main command center for the application, presenting daily spiritual context, active prayer countdown, direct tool shortcuts, and daily inspiration.

---

## 2. Directory Structure

```
src/features/home/
├── components/
│   └── HomeScreen.tsx       # Main dashboard layout, cards, and quick actions
├── data/
│   └── home.mock.ts         # Mock dashboard dates, next prayer, and daily verse
├── types/
│   └── home.types.ts        # QuickActionItem, DailyVerse, and HomeDashboardMock types
└── index.ts                 # Public module export barrier
```

---

## 3. UI Components & Visual Elements

- **Header Greeting:** "Assalamu Alaikum", Hijri date banner (`14 Rabi al-Awwal 1448 AH`), Gregorian date, and current city.
- **Next Prayer Hero Spotlight:** Displays upcoming Salah (`Asr at 03:45 PM`), time remaining (`01h 24m remaining`), and direct link to the Prayer Times screen.
- **Quick Action Grid:** Cards for Prayer Times, Qibla Compass, Holy Quran, and Tasbeeh counter.
- **Qibla Finder Banner:** Highlighting live compass alignment with direct link to the Qibla screen.
- **Ayah of the Day:** Styled Arabic script with English translation and Surah citation.
