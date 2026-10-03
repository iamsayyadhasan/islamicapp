import { HomeDashboardData } from '../types/home.types';

export const MOCK_HOME_DASHBOARD: HomeDashboardData = {
  userName: 'Hasan',
  greeting: 'Assalamu Alaikum',
  location: 'Badaun, India',
  nextPrayer: {
    name: 'Asr',
    countdown: '01:24:35',
    dateLabel: 'May 13, 2025 / 15 Dhul-Qadah 1446',
  },
  prayers: [
    { id: 'fajr', name: 'Fajr', time: '4:32 AM', isActive: false },
    { id: 'sunrise', name: 'Sunrise', time: '6:01 AM', isActive: false },
    { id: 'dhuhr', name: 'Dhuhr', time: '12:32 PM', isActive: false },
    { id: 'asr', name: 'Asr', time: '4:58 PM', isActive: true },
    { id: 'maghrib', name: 'Maghrib', time: '7:10 PM', isActive: false },
    { id: 'isha', name: 'Isha', time: '8:30 PM', isActive: false },
  ],
};
