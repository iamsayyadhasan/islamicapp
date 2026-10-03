export interface HomePrayerItem {
  id: string;
  name: string;
  time: string;
  isActive: boolean;
}

export interface NextPrayerInfo {
  name: string;
  countdown: string;
  dateLabel: string;
}

export interface HomeDashboardData {
  userName: string;
  greeting: string;
  location: string;
  nextPrayer: NextPrayerInfo;
  prayers: HomePrayerItem[];
}
