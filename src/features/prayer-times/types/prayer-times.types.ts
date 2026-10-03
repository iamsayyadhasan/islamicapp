export interface PrayerScheduleItem {
  id: string;
  name: string;
  time: string;
  isActive: boolean;
}

export interface PrayerTimesScreenData {
  location: string;
  gregorianDate: string;
  hijriDate: string;
  calculationMethod: string;
  madhab: string;
  prayers: PrayerScheduleItem[];
}
