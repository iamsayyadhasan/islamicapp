import { PrayerTimesScreenData } from '../types/prayer-times.types';

export const MOCK_PRAYER_TIMES_SCREEN: PrayerTimesScreenData = {
  location: 'New Delhi, India',
  gregorianDate: 'May 13, 2025',
  hijriDate: '15 Dhul-Qadah 1446',
  calculationMethod: 'Muslim World League',
  madhab: "Shafi'i",
  prayers: [
    { id: 'fajr', name: 'Fajr', time: '4:32 AM', isActive: false },
    { id: 'sunrise', name: 'Sunrise', time: '6:01 AM', isActive: false },
    { id: 'dhuhr', name: 'Dhuhr', time: '12:32 PM', isActive: false },
    { id: 'asr', name: 'Asr', time: '4:58 PM', isActive: true },
    { id: 'maghrib', name: 'Maghrib', time: '7:10 PM', isActive: false },
    { id: 'isha', name: 'Isha', time: '8:30 PM', isActive: false },
  ],
};
