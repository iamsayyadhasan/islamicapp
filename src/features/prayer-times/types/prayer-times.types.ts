import type { PrayerScheduleItem } from '@/utils/prayer-schedule';
export type { PrayerScheduleItem };

export interface PrayerTimesScreenData {
  location: string;
  gregorianDate: string;
  hijriDate: string;
  calculationMethod: string;
  madhab: string;
  prayers: PrayerScheduleItem[];
}
