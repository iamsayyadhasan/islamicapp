import { IslamicEvent } from '../types/calendar.types';

export const GREGORIAN_MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

export const HIJRI_MONTH_NAMES = [
  'Muharram',
  'Safar',
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qi'dah",
  'Dhu al-Hijjah',
] as const;

/**
 * Deterministic mapping of Gregorian months to corresponding Hijri months for 2025 (1446-1447 AH).
 * Reference: Umm al-Qura lunar calendar estimations.
 * Note: Actual Islamic dates are subject to local moon sightings.
 */
export const GREGORIAN_TO_HIJRI_MAP: Record<
  number,
  { hijriMonthName: string; hijriYear: string; hijriMonthIndex: number }
> = {
  0: { hijriMonthName: 'Rajab', hijriYear: '1446 AH', hijriMonthIndex: 7 },
  1: { hijriMonthName: "Sha'ban", hijriYear: '1446 AH', hijriMonthIndex: 8 },
  2: { hijriMonthName: 'Ramadan', hijriYear: '1446 AH', hijriMonthIndex: 9 },
  3: { hijriMonthName: 'Shawwal', hijriYear: '1446 AH', hijriMonthIndex: 10 },
  4: { hijriMonthName: "Dhu al-Qi'dah", hijriYear: '1446 AH', hijriMonthIndex: 11 },
  5: { hijriMonthName: 'Dhu al-Hijjah', hijriYear: '1446 AH', hijriMonthIndex: 12 },
  6: { hijriMonthName: 'Muharram', hijriYear: '1447 AH', hijriMonthIndex: 1 },
  7: { hijriMonthName: 'Safar', hijriYear: '1447 AH', hijriMonthIndex: 2 },
  8: { hijriMonthName: "Rabi' al-Awwal", hijriYear: '1447 AH', hijriMonthIndex: 3 },
  9: { hijriMonthName: "Rabi' al-Thani", hijriYear: '1447 AH', hijriMonthIndex: 4 },
  10: { hijriMonthName: 'Jumada al-Awwal', hijriYear: '1447 AH', hijriMonthIndex: 5 },
  11: { hijriMonthName: 'Jumada al-Thani', hijriYear: '1447 AH', hijriMonthIndex: 6 },
};

/**
 * Approximate Hijri day calculator for deterministic UI rendering.
 * Provides consistent day-to-day lunar progression (1-30) across selected dates.
 */
export function getApproximateHijriDate(
  year: number,
  month: number,
  day: number,
): {
  hijriDay: number;
  hijriMonthName: string;
  hijriYear: string;
} {
  const info = GREGORIAN_TO_HIJRI_MAP[month] ?? {
    hijriMonthName: "Dhu al-Qi'dah",
    hijriYear: '1446 AH',
    hijriMonthIndex: 11,
  };

  // Approximate offset for lunar day progression within the month
  const hijriDay = ((day + 1) % 30) + 1;
  const yearOffset = year - 2025;
  const baseYearNumber = info.hijriYear.startsWith('1446') ? 1446 : 1447;
  const hijriYear = `${baseYearNumber + yearOffset} AH`;

  return {
    hijriDay,
    hijriMonthName: info.hijriMonthName,
    hijriYear,
  };
}

/**
 * Key Islamic Events and Occasions.
 * Source: Standard Islamic calendar reference (1446-1447 AH / 2025 CE).
 */
export const MOCK_ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    id: 'ramadan-start',
    name: '1st Ramadan (Start of Fasting)',
    hijriDate: '1 Ramadan 1446',
    gregorianDate: 'March 1, 2025',
    category: 'fasting',
    badgeLabel: 'Holy Month',
    description: 'First day of obligatory fasting in the blessed month of Ramadan.',
    hijriMonth: 9,
    hijriDay: 1,
  },
  {
    id: 'laylat-al-qadr',
    name: 'Laylat al-Qadr (Night of Power)',
    hijriDate: '27 Ramadan 1446',
    gregorianDate: 'March 27, 2025',
    category: 'major',
    badgeLabel: 'Sacred Night',
    description: 'The night the Holy Qur’an was first revealed, better than a thousand months.',
    hijriMonth: 9,
    hijriDay: 27,
  },
  {
    id: 'eid-al-fitr',
    name: 'Eid al-Fitr',
    hijriDate: '1 Shawwal 1446',
    gregorianDate: 'March 31, 2025',
    category: 'major',
    badgeLabel: 'Eid Celebration',
    description: 'Celebration marking the conclusion of the holy month of Ramadan.',
    hijriMonth: 10,
    hijriDay: 1,
  },
  {
    id: 'day-of-arafah',
    name: 'Day of Arafah',
    hijriDate: '9 Dhu al-Hijjah 1446',
    gregorianDate: 'June 5, 2025',
    category: 'fasting',
    badgeLabel: 'Sunnah Fast',
    description: 'The pinnacle day of Hajj; fasting on this day expiates sins of two years.',
    hijriMonth: 12,
    hijriDay: 9,
  },
  {
    id: 'eid-al-adha',
    name: 'Eid al-Adha',
    hijriDate: '10 Dhu al-Hijjah 1446',
    gregorianDate: 'June 6, 2025',
    category: 'major',
    badgeLabel: 'Eid Celebration',
    description: 'Feast of the Sacrifice commemorating the devotion of Prophet Ibrahim (AS).',
    hijriMonth: 12,
    hijriDay: 10,
  },
  {
    id: 'islamic-new-year',
    name: 'Islamic New Year (1447 AH)',
    hijriDate: '1 Muharram 1447',
    gregorianDate: 'June 26, 2025',
    category: 'historical',
    badgeLabel: 'New Hijri Year',
    description: 'Beginning of the new Islamic lunar year commemorating the Hijrah to Madinah.',
    hijriMonth: 1,
    hijriDay: 1,
  },
  {
    id: 'day-of-ashura',
    name: 'Day of Ashura',
    hijriDate: '10 Muharram 1447',
    gregorianDate: 'July 5, 2025',
    category: 'fasting',
    badgeLabel: 'Sunnah Fast',
    description: 'Historical day of salvation for Prophet Musa (AS); highly recommended fast.',
    hijriMonth: 1,
    hijriDay: 10,
  },
  {
    id: 'mawlid-al-nabi',
    name: 'Mawlid al-Nabi',
    hijriDate: "12 Rabi' al-Awwal 1447",
    gregorianDate: 'September 5, 2025',
    category: 'historical',
    badgeLabel: 'Commemoration',
    description: 'Commemoration of the birth of Prophet Muhammad (peace be upon him).',
    hijriMonth: 3,
    hijriDay: 12,
  },
];
