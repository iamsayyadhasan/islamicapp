# Qibla Feature Documentation

**Module:** `src/features/qibla`  
**Current Milestone:** UI Presentation Only (Static Mock Data)

---

## 1. Feature Overview

The Qibla module provides a visual compass interface indicating the direction of the Holy Kaaba in Makkah. In this initial milestone, the UI layout, compass dial, pointer indicators, info metrics, and location selector are fully implemented with responsive static/mock data.

---

## 2. Directory Structure

```
src/features/qibla/
├── components/
│   ├── CompassDial.tsx      # 360° cardinal ring & alignment glow indicator
│   ├── CompassNeedle.tsx    # North/South magnetic needle & Kaaba outer pointer
│   ├── QiblaInfoCard.tsx    # Alignment status banner, degrees, and distance metrics
│   └── QiblaScreen.tsx      # Main feature container integrating sub-components
├── data/
│   └── qibla.mock.ts        # Static mock locations and UI state fixtures
├── types/
│   └── qibla.types.ts       # Domain UI interfaces (QiblaUiState, QiblaLocationMock)
└── index.ts                 # Public module export barrier
```

---

## 3. UI Component Breakdown

- **`CompassDial`**: Renders the 360-degree compass wheel, major cardinal labels (`N`, `E`, `S`, `W`), intermediate ticks (`NE`, `SE`, `SW`, `NW`), and the glowing green aura ring when the user is aligned with the Qibla.
- **`CompassNeedle`**: Renders the magnetic compass needle (Red North tip, Slate South tip, and Center pivot hub) along with the Kaaba emblem badge on the outer rim.
- **`QiblaInfoCard`**: Displays the active alignment banner (`✓ Facing Kaaba (Qibla)` / `Rotate towards Qibla`), angle metrics (`Qibla Angle`, `Device Heading`, `Distance in km`), and active reference location.
- **`QiblaScreen`**: Screen orchestration component with title header, horizontal location selector pills (London, Jakarta, Cairo, New York), compass visualization, and calibration tip.

---

## 4. Current Mock Data Fixtures

Mock locations are strictly isolated in `src/features/qibla/data/qibla.mock.ts`:

- **London, UK**: Bearing `119° ESE`, Distance `4,792 km`.
- **Jakarta, Indonesia**: Bearing `295° WNW`, Distance `7,914 km`.
- **Cairo, Egypt**: Bearing `136° SE`, Distance `1,286 km`.
- **New York, US**: Bearing `58° ENE`, Distance `10,298 km`.

---

## 5. Future Functional Milestones (Deferred)

The following will be introduced in subsequent functional milestones:

1. **Device Sensor Integration**: `expo-sensors` magnetometer subscription for real-time heading rotation.
2. **GPS Geolocation**: `expo-location` for automatic user latitude/longitude detection.
3. **Calculation Engine**: Great Circle forward azimuth formula calculating the bearing from user coordinates to Kaaba coordinates ($21.4225^\circ\text{ N}, 39.8262^\circ\text{ E}$).
4. **Haptic Feedback**: `expo-haptics` triggering gentle vibration when aligned with the Qibla.
