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
  madhab: "Shafi'i",
  prayers: SHARED_PRAYER_SCHEDULE,
};

// Backward-compatibility alias
export const MOCK_PRAYER_TIMES_SCREEN = SHARED_PRAYER_TIMES_DATA;

/**
 * Parses time string like "4:58 PM" into minutes from midnight (0 - 1439).
 */
export function parsePrayerTimeToMinutes(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

/**
 * Returns the current day seconds from midnight (0 to 86399) based on the system clock.
 */
export function getCurrentDaySeconds(date: Date = new Date()): number {
  return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
}

/**
 * Default simulated time on reference date May 13, 2025:
 * 3:33:25 PM (15:33:25) -> exactly 56,005 seconds from midnight.
 * Next prayer is Asr at 4:58 PM (61,080 seconds).
 * Difference = 5,075 seconds = 01:24:35 countdown.
 */
export const DEFAULT_SIMULATED_SECONDS = 15 * 3600 + 33 * 60 + 25;

export interface DerivedPrayerState {
  nextPrayerName: string;
  targetPrayerTime: string;
  remainingSeconds: number;
  countdown: { h: number; m: number; s: number };
  countdownString: string;
  prayersWithActiveState: PrayerScheduleItem[];
}

/**
 * Mathematically derives the next prayer and remaining countdown
 * directly from the schedule timetable based on the clock time.
 * Handles prayer progression, midnight rollover, and excludes Sunrise.
 */
export function deriveNextPrayerFromSchedule(
  prayers: PrayerScheduleItem[] = SHARED_PRAYER_SCHEDULE,
  currentDaySeconds: number = getCurrentDaySeconds(),
): DerivedPrayerState {
  const prayerTimesInSeconds = prayers.map((p) => {
    const minutes = parsePrayerTimeToMinutes(p.time);
    return {
      prayer: p,
      seconds: minutes * 60,
    };
  });

  // Next fard prayer strictly after reference time (excluding sunrise)
  let next = prayerTimesInSeconds.find(
    (item) => item.seconds > currentDaySeconds && item.prayer.id !== 'sunrise',
  );

  let remaining = 0;
  if (next) {
    remaining = next.seconds - currentDaySeconds;
  } else {
    // If after Isha, wrap around to Fajr tomorrow
    const fajr = prayerTimesInSeconds.find((item) => item.prayer.id === 'fajr');
    if (fajr) {
      next = fajr;
      remaining = 24 * 3600 - currentDaySeconds + fajr.seconds;
    } else {
      next = prayerTimesInSeconds[0];
      remaining = 0;
    }
  }

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  const pad2 = (n: number) => String(n).padStart(2, '0');
  const countdownString = `${pad2(h)}:${pad2(m)}:${pad2(s)}`;

  const prayersWithActiveState = prayers.map((p) => ({
    ...p,
    isActive: p.id === next?.prayer.id,
  }));

  return {
    nextPrayerName: next?.prayer.name ?? 'Asr',
    targetPrayerTime: next?.prayer.time ?? '4:58 PM',
    remainingSeconds: remaining,
    countdown: { h, m, s },
    countdownString,
    prayersWithActiveState,
  };
}
