import { PrayerScheduleItem, PrayerTimesScreenData } from '../types/prayer-times.types';

/**
 * Shared prayer timetable fixture used across Home and Prayer Times screens.
 * Exactly one entry per prayer to prevent duplicate rows.
 */
export const SHARED_PRAYER_SCHEDULE: PrayerScheduleItem[] = [
  { id: 'fajr', name: 'Fajr', time: '4:32 AM', isActive: false },
  { id: 'sunrise', name: 'Sunrise', time: '6:01 AM', isActive: false },
  { id: 'dhuhr', name: 'Dhuhr', time: '12:32 PM', isActive: false },
  { id: 'asr', name: 'Asr', time: '4:58 PM', isActive: true },
  { id: 'maghrib', name: 'Maghrib', time: '7:10 PM', isActive: false },
  { id: 'isha', name: 'Isha', time: '8:30 PM', isActive: false },
];

/**
 * Shared screen metadata. Location is explicitly marked as Sample
 * to avoid claiming accuracy for the user's real physical coordinates.
 */
export const SHARED_PRAYER_TIMES_DATA: PrayerTimesScreenData = {
  location: 'Badaun, India (Sample)',
  gregorianDate: 'May 13, 2025',
  hijriDate: '15 Dhul-Qadah 1446',
  calculationMethod: 'Muslim World League',
  madhab: 'Hanafi',
  prayers: SHARED_PRAYER_SCHEDULE,
};

// Backward-compatibility alias
export const MOCK_PRAYER_TIMES_SCREEN = SHARED_PRAYER_TIMES_DATA;

// Re-export schedule calculation utilities from shared utils for backward compatibility
export {
  DEFAULT_SIMULATED_SECONDS,
  parsePrayerTimeToMinutes,
  getCurrentDaySeconds,
  deriveNextPrayerFromSchedule,
} from '@/utils/prayer-schedule';
export type { DerivedPrayerState } from '@/utils/prayer-schedule';
