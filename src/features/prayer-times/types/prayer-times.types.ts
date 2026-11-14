import type { PrayerScheduleItem } from '@/utils/prayer-schedule';
export type { PrayerScheduleItem };

export type CalculationMethodKey =
  'Karachi' | 'MuslimWorldLeague' | 'Egyptian' | 'Kuwait' | 'Qatar' | 'Turkey' | 'Singapore';

export type MadhabKey = 'Hanafi' | 'Shafi';

export interface CalculationMethodInfo {
  key: CalculationMethodKey;
  label: string;
  description: string;
  region: string;
}

export interface MadhabInfo {
  key: MadhabKey;
  label: string;
  description: string;
}

export interface NextPrayerCountdown {
  id: string;
  name: string;
  time: string;
  rawDate: Date;
  countdownString: string;
  remainingSeconds: number;
  isTomorrowFajr: boolean;
}

export interface DynamicPrayerScheduleResult {
  prayers: PrayerScheduleItem[];
  nextPrayer: NextPrayerCountdown;
  currentPrayer: PrayerScheduleItem | null;
  gregorianDate: string;
  hijriDateEstimated: string;
  calculationMethodLabel: string;
  madhabLabel: string;
  isUsingFallback: boolean;
  sampleLocationNote?: string;
}

export interface PrayerTimesScreenData {
  location: string;
  gregorianDate: string;
  hijriDate: string;
  calculationMethod: string;
  madhab: string;
  prayers: PrayerScheduleItem[];
}
