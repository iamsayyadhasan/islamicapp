import { HomeDashboardData } from '../types/home.types';
import {
  SHARED_PRAYER_SCHEDULE,
  SHARED_PRAYER_TIMES_DATA,
} from '@/features/prayer-times/data/prayer-times.mock';
import { deriveNextPrayerFromSchedule } from '@/utils/prayer-schedule';

const initialDerived = deriveNextPrayerFromSchedule(SHARED_PRAYER_SCHEDULE);

export const MOCK_HOME_DASHBOARD: HomeDashboardData = {
  userName: 'Hasan',
  greeting: 'Assalamu Alaikum',
  location: SHARED_PRAYER_TIMES_DATA.location,
  nextPrayer: {
    name: initialDerived.nextPrayerName,
    countdown: initialDerived.countdownString,
    dateLabel: `${SHARED_PRAYER_TIMES_DATA.gregorianDate} / ${SHARED_PRAYER_TIMES_DATA.hijriDate}`,
  },
  prayers: initialDerived.prayersWithActiveState,
};
