import { CalculationMethod, CalculationParameters, Coordinates, Madhab, PrayerTimes } from 'adhan';
import {
  CALCULATION_METHOD_OPTIONS,
  DEFAULT_CALCULATION_METHOD,
  DEFAULT_MADHAB,
  MADHAB_OPTIONS,
} from '../data/prayer-calculation-methods';
import {
  CalculationMethodKey,
  DynamicPrayerScheduleResult,
  MadhabKey,
  NextPrayerCountdown,
  PrayerScheduleItem,
} from '../types/prayer-times.types';

export function getCalculationParameters(methodKey: CalculationMethodKey): CalculationParameters {
  const methodFn = CalculationMethod[methodKey];
  if (typeof methodFn === 'function') {
    return methodFn();
  }
  return CalculationMethod.Karachi();
}

export function formatTime12h(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 hour should be 12
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minutesStr} ${ampm}`;
}

export function formatGregorianDate(date: Date): string {
  const months = [
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
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

const pad2 = (n: number) => String(n).padStart(2, '0');

export function formatCountdownString(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = clamped % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

export interface CalculateScheduleParams {
  coords: { latitude: number; longitude: number };
  now?: Date;
  calculationMethod?: CalculationMethodKey;
  madhab?: MadhabKey;
  isUsingFallback?: boolean;
}

export function calculateDailyPrayerSchedule({
  coords,
  now = new Date(),
  calculationMethod = DEFAULT_CALCULATION_METHOD,
  madhab = DEFAULT_MADHAB,
  isUsingFallback = false,
}: CalculateScheduleParams): DynamicPrayerScheduleResult {
  const coordinates = new Coordinates(coords.latitude, coords.longitude);
  const params = getCalculationParameters(calculationMethod);
  params.madhab = madhab === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;

  const todayTimes = new PrayerTimes(coordinates, now, params);

  // Compute tomorrow for post-Isha Fajr rollover
  const tomorrowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const tomorrowTimes = new PrayerTimes(coordinates, tomorrowDate, params);

  const fajrTime = todayTimes.fajr;
  const sunriseTime = todayTimes.sunrise;
  const dhuhrTime = todayTimes.dhuhr;
  const asrTime = todayTimes.asr;
  const maghribTime = todayTimes.maghrib;
  const ishaTime = todayTimes.isha;
  const tomorrowFajrTime = tomorrowTimes.fajr;

  const nowMs = now.getTime();

  // Determine active prayer window (excluding sunrise as an active fard prayer)
  let activePrayerId: string | null = null;
  if (nowMs >= fajrTime.getTime() && nowMs < sunriseTime.getTime()) {
    activePrayerId = 'fajr';
  } else if (nowMs >= dhuhrTime.getTime() && nowMs < asrTime.getTime()) {
    activePrayerId = 'dhuhr';
  } else if (nowMs >= asrTime.getTime() && nowMs < maghribTime.getTime()) {
    activePrayerId = 'asr';
  } else if (nowMs >= maghribTime.getTime() && nowMs < ishaTime.getTime()) {
    activePrayerId = 'maghrib';
  } else if (nowMs >= ishaTime.getTime() || nowMs < fajrTime.getTime()) {
    activePrayerId = 'isha';
  }

  // Determine next obligatory prayer (Sunrise is strictly excluded)
  let nextPrayerTarget: { id: string; name: string; rawDate: Date; isTomorrow: boolean };

  if (nowMs < fajrTime.getTime()) {
    nextPrayerTarget = { id: 'fajr', name: 'Fajr', rawDate: fajrTime, isTomorrow: false };
  } else if (nowMs < dhuhrTime.getTime()) {
    nextPrayerTarget = { id: 'dhuhr', name: 'Dhuhr', rawDate: dhuhrTime, isTomorrow: false };
  } else if (nowMs < asrTime.getTime()) {
    nextPrayerTarget = { id: 'asr', name: 'Asr', rawDate: asrTime, isTomorrow: false };
  } else if (nowMs < maghribTime.getTime()) {
    nextPrayerTarget = { id: 'maghrib', name: 'Maghrib', rawDate: maghribTime, isTomorrow: false };
  } else if (nowMs < ishaTime.getTime()) {
    nextPrayerTarget = { id: 'isha', name: 'Isha', rawDate: ishaTime, isTomorrow: false };
  } else {
    // Past Isha -> Next prayer is tomorrow's Fajr
    nextPrayerTarget = {
      id: 'fajr',
      name: 'Fajr',
      rawDate: tomorrowFajrTime,
      isTomorrow: true,
    };
  }

  const remainingSeconds = Math.max(
    0,
    Math.floor((nextPrayerTarget.rawDate.getTime() - nowMs) / 1000),
  );

  const nextPrayer: NextPrayerCountdown = {
    id: nextPrayerTarget.id,
    name: nextPrayerTarget.name,
    time: formatTime12h(nextPrayerTarget.rawDate),
    rawDate: nextPrayerTarget.rawDate,
    countdownString: formatCountdownString(remainingSeconds),
    remainingSeconds,
    isTomorrowFajr: nextPrayerTarget.isTomorrow,
  };

  const prayers: PrayerScheduleItem[] = [
    {
      id: 'fajr',
      name: 'Fajr',
      time: formatTime12h(fajrTime),
      isActive: activePrayerId === 'fajr',
    },
    {
      id: 'sunrise',
      name: 'Sunrise',
      time: formatTime12h(sunriseTime),
      isActive: false,
    },
    {
      id: 'dhuhr',
      name: 'Dhuhr',
      time: formatTime12h(dhuhrTime),
      isActive: activePrayerId === 'dhuhr',
    },
    {
      id: 'asr',
      name: 'Asr',
      time: formatTime12h(asrTime),
      isActive: activePrayerId === 'asr',
    },
    {
      id: 'maghrib',
      name: 'Maghrib',
      time: formatTime12h(maghribTime),
      isActive: activePrayerId === 'maghrib',
    },
    {
      id: 'isha',
      name: 'Isha',
      time: formatTime12h(ishaTime),
      isActive: activePrayerId === 'isha',
    },
  ];

  const currentPrayer = prayers.find((p) => p.isActive) ?? null;

  const methodInfo =
    CALCULATION_METHOD_OPTIONS.find((m) => m.key === calculationMethod) ??
    CALCULATION_METHOD_OPTIONS[0];

  const madhabInfo = MADHAB_OPTIONS.find((m) => m.key === madhab) ?? MADHAB_OPTIONS[0];

  // Estimated Hijri date label explicitly flagged as approximation (Requirement #12)
  const hijriYearEst = now.getFullYear() - 579;
  const hijriDateEstimated = `~${hijriYearEst} AH (Estimated)`;

  return {
    prayers,
    nextPrayer,
    currentPrayer,
    gregorianDate: formatGregorianDate(now),
    hijriDateEstimated,
    calculationMethodLabel: methodInfo.label,
    madhabLabel: madhabInfo.label,
    isUsingFallback,
    sampleLocationNote: isUsingFallback
      ? 'Calculated from sample coordinates. Enable GPS for your exact timetable.'
      : undefined,
  };
}
