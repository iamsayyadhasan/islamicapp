export interface CalendarDay {
  year: number;
  month: number; // 0-indexed: 0 = January, 11 = December
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isFriday: boolean;
  hijriDay?: number;
}

export type EventCategory = 'major' | 'fasting' | 'historical';

export interface IslamicEvent {
  id: string;
  name: string;
  hijriDate: string;
  gregorianDate: string;
  category: EventCategory;
  badgeLabel: string;
  description?: string;
  hijriMonth: number; // 1-12
  hijriDay: number;
}

export interface MonthInfo {
  year: number;
  month: number; // 0-11
  monthName: string;
  hijriMonthName: string;
  hijriYear: string;
}

export interface SelectedDateDetails {
  year: number;
  month: number;
  day: number;
  gregorianFormatted: string;
  hijriFormatted: string;
  dayOfWeek: string;
  isFriday: boolean;
}
