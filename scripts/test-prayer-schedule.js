// Unit test suite for prayer schedule calculation utilities & location formatters
const assert = require('assert');

function parsePrayerTimeToMinutes(timeStr) {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function deriveNextPrayerFromSchedule(prayers, currentDaySeconds) {
  const prayerTimesInSeconds = prayers.map((p) => {
    const minutes = parsePrayerTimeToMinutes(p.time);
    return {
      prayer: p,
      seconds: minutes * 60,
    };
  });

  let next = prayerTimesInSeconds.find(
    (item) => item.seconds > currentDaySeconds && item.prayer.id !== 'sunrise',
  );

  let remaining = 0;
  if (next) {
    remaining = next.seconds - currentDaySeconds;
  } else {
    const fajr = prayerTimesInSeconds.find((item) => item.prayer.id === 'fajr');
    if (fajr) {
      next = fajr;
      remaining = 24 * 3600 - currentDaySeconds + fajr.seconds;
    } else {
      next = prayerTimesInSeconds[0];
      remaining = 0;
    }
  }

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  const pad2 = (n) => String(n).padStart(2, '0');
  const countdownString = `${pad2(h)}:${pad2(m)}:${pad2(s)}`;

  const prayersWithActiveState = prayers.map((p) => ({
    ...p,
    isActive: p.id === next?.prayer.id,
  }));

  return {
    nextPrayerName: next?.prayer.name ?? 'Asr',
    targetPrayerTime: next?.prayer.time ?? '4:58 PM',
    remainingSeconds: remaining,
    countdown: { h, m, s },
    countdownString,
    prayersWithActiveState,
  };
}

function formatCoordinates(lat, lng) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

const mockPrayers = [
  { id: 'fajr', name: 'Fajr', time: '4:32 AM', isActive: false },
  { id: 'sunrise', name: 'Sunrise', time: '6:01 AM', isActive: false },
  { id: 'dhuhr', name: 'Dhuhr', time: '12:32 PM', isActive: false },
  { id: 'asr', name: 'Asr', time: '4:58 PM', isActive: true },
  { id: 'maghrib', name: 'Maghrib', time: '7:10 PM', isActive: false },
  { id: 'isha', name: 'Isha', time: '8:30 PM', isActive: false },
];

console.log('=== RUNNING PRAYER SCHEDULE & FORMATTER UNIT TESTS ===\n');

// Suite 1: Time Parsing
console.log('[Suite 1: Time Parsing to Minutes]');
assert.strictEqual(parsePrayerTimeToMinutes('4:32 AM'), 4 * 60 + 32, '1.1 Fajr 4:32 AM');
console.log('PASS: 1.1 Fajr 4:32 AM = 272 mins');
assert.strictEqual(parsePrayerTimeToMinutes('12:00 AM'), 0, '1.2 Midnight 12:00 AM = 0 mins');
console.log('PASS: 1.2 Midnight 12:00 AM = 0 mins');
assert.strictEqual(
  parsePrayerTimeToMinutes('12:32 PM'),
  12 * 60 + 32,
  '1.3 Dhuhr 12:32 PM = 752 mins',
);
console.log('PASS: 1.3 Dhuhr 12:32 PM = 752 mins');
assert.strictEqual(
  parsePrayerTimeToMinutes('4:58 PM'),
  16 * 60 + 58,
  '1.4 Asr 4:58 PM = 1018 mins',
);
console.log('PASS: 1.4 Asr 4:58 PM = 1018 mins');
assert.strictEqual(parsePrayerTimeToMinutes('invalid-time'), 0, '1.5 Malformed time defaults to 0');
console.log('PASS: 1.5 Malformed time defaults to 0');

// Suite 2: Next Prayer Derivation
console.log('\n[Suite 2: Next Prayer Derivation]');
// 3:00 AM (10,800s) -> Next is Fajr (4:32 AM)
const beforeFajr = deriveNextPrayerFromSchedule(mockPrayers, 3 * 3600);
assert.strictEqual(beforeFajr.nextPrayerName, 'Fajr', '2.1 Next is Fajr before 4:32 AM');
assert.strictEqual(beforeFajr.countdownString, '01:32:00', '2.2 Countdown to Fajr');
console.log('PASS: 2.1 Next is Fajr before 4:32 AM');
console.log('PASS: 2.2 Countdown to Fajr is correct (01:32:00)');

// 5:00 AM (after Fajr, before Sunrise 6:01 AM) -> Next should be Dhuhr (Sunrise skipped for fard)
const afterFajr = deriveNextPrayerFromSchedule(mockPrayers, 5 * 3600);
assert.strictEqual(afterFajr.nextPrayerName, 'Dhuhr', '2.3 Sunrise is skipped, next is Dhuhr');
console.log('PASS: 2.3 Sunrise is skipped, next fard is Dhuhr');

// 3:33:25 PM (56,005s) -> Next is Asr (4:58 PM = 61,080s), diff = 5075s = 01:24:35
const midAfternoon = deriveNextPrayerFromSchedule(mockPrayers, 15 * 3600 + 33 * 60 + 25);
assert.strictEqual(midAfternoon.nextPrayerName, 'Asr', '2.4 Next is Asr at 3:33 PM');
assert.strictEqual(
  midAfternoon.countdownString,
  '01:24:35',
  '2.5 Exact reference countdown matches',
);
console.log('PASS: 2.4 Next is Asr at 3:33 PM');
console.log('PASS: 2.5 Reference countdown matches exactly (01:24:35)');

// 11:00 PM (after Isha 8:30 PM) -> Wraparound to tomorrow Fajr
const lateNight = deriveNextPrayerFromSchedule(mockPrayers, 23 * 3600);
assert.strictEqual(lateNight.nextPrayerName, 'Fajr', '2.6 Midnight wraparound to Fajr');
// 23:00 to 24:00 is 1h (3600s), plus Fajr 4:32 is 4h 32m (16320s) = 5h 32m (19920s)
assert.strictEqual(lateNight.countdownString, '05:32:00', '2.7 Midnight rollover countdown');
console.log('PASS: 2.6 Midnight rollover correctly targets Fajr tomorrow');
console.log('PASS: 2.7 Midnight rollover countdown matches exactly (05:32:00)');

// Suite 3: Active State Mapping
console.log('\n[Suite 3: Active State Mapping]');
const activeItem = midAfternoon.prayersWithActiveState.find((p) => p.isActive);
assert.strictEqual(activeItem.id, 'asr', '3.1 Asr is marked as the single active prayer');
assert.strictEqual(
  midAfternoon.prayersWithActiveState.filter((p) => p.isActive).length,
  1,
  '3.2 Exactly one prayer is marked active',
);
console.log('PASS: 3.1 Asr is marked as the single active prayer');
console.log('PASS: 3.2 Exactly one prayer is marked active');

// Suite 4: Coordinate Formatter
console.log('\n[Suite 4: Coordinate Formatter]');
const coords1 = formatCoordinates(28.6139, 77.209);
assert.strictEqual(coords1, '28.6139° N, 77.2090° E', '4.1 Northern/Eastern coordinates');
console.log('PASS: 4.1 Positive lat/lng formats to N/E (28.6139° N, 77.2090° E)');

const coords2 = formatCoordinates(-33.8688, 151.2093);
assert.strictEqual(coords2, '33.8688° S, 151.2093° E', '4.2 Southern latitude');
console.log('PASS: 4.2 Negative latitude formats to S (33.8688° S, 151.2093° E)');

const coords3 = formatCoordinates(40.7128, -74.006);
assert.strictEqual(coords3, '40.7128° N, 74.0060° W', '4.3 Western longitude');
console.log('PASS: 4.3 Negative longitude formats to W (40.7128° N, 74.0060° W)');

console.log('\n=== RESULTS: ALL 14 TESTS PASSED! ===');
