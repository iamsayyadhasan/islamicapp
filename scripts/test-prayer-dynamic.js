// Comprehensive test suite for dynamic prayer calculations using adhan
const assert = require('assert');
const adhan = require('adhan');

const { Coordinates, CalculationMethod, Madhab, PrayerTimes } = adhan;

console.log('=== RUNNING DYNAMIC PRAYER CALCULATION TESTS ===\n');
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`PASS: ${name}`);
  } catch (err) {
    console.error(`FAIL: ${name}`);
    console.error(err);
    failed++;
  }
}

const NEW_DELHI = { latitude: 28.6139, longitude: 77.209 };
const testDate = new Date(2026, 9, 20, 12, 0, 0); // Oct 20, 2026 12:00 PM

// -------------------------------------------------------------
// Suite 1: Calculation Methods Differences
// -------------------------------------------------------------
console.log('[Suite 1: Calculation Methods]');

test('1.1 Karachi vs Muslim World League parameters', () => {
  const coords = new Coordinates(NEW_DELHI.latitude, NEW_DELHI.longitude);

  const karachiParams = CalculationMethod.Karachi();
  const mwlParams = CalculationMethod.MuslimWorldLeague();

  const karachiTimes = new PrayerTimes(coords, testDate, karachiParams);
  const mwlTimes = new PrayerTimes(coords, testDate, mwlParams);

  // Karachi has 18 deg Isha, MWL has 17 deg Isha -> Isha times should differ
  assert.notStrictEqual(
    karachiTimes.isha.getTime(),
    mwlTimes.isha.getTime(),
    'Karachi and MWL Isha times must differ due to angle variation',
  );
  assert(
    karachiTimes.isha.getTime() > mwlTimes.isha.getTime(),
    'Karachi Isha (18°) is darker/later than MWL (17°)',
  );
});

test('1.2 Umm Al-Qura sets Isha 90 minutes after Maghrib', () => {
  const coords = new Coordinates(21.4225, 39.8262); // Makkah
  const uaqParams = CalculationMethod.UmmAlQura();
  const uaqTimes = new PrayerTimes(coords, testDate, uaqParams);

  const diffMinutes = Math.round((uaqTimes.isha.getTime() - uaqTimes.maghrib.getTime()) / 60000);
  assert.strictEqual(
    diffMinutes,
    90,
    `Umm Al-Qura Isha must be exactly 90 minutes after Maghrib (got ${diffMinutes}m)`,
  );
});

// -------------------------------------------------------------
// Suite 2: Madhab Comparison (Hanafi vs Shafi'i Asr)
// -------------------------------------------------------------
console.log('\n[Suite 2: Madhab Asr Comparison]');

test('2.1 Hanafi Asr is strictly later than Shafi Asr', () => {
  const coords = new Coordinates(NEW_DELHI.latitude, NEW_DELHI.longitude);

  const shafiParams = CalculationMethod.Karachi();
  shafiParams.madhab = Madhab.Shafi;

  const hanafiParams = CalculationMethod.Karachi();
  hanafiParams.madhab = Madhab.Hanafi;

  const shafiTimes = new PrayerTimes(coords, testDate, shafiParams);
  const hanafiTimes = new PrayerTimes(coords, testDate, hanafiParams);

  const diffMinutes = (hanafiTimes.asr.getTime() - shafiTimes.asr.getTime()) / 60000;

  assert(
    hanafiTimes.asr.getTime() > shafiTimes.asr.getTime(),
    'Hanafi Asr must be strictly later than Shafi Asr',
  );
  assert(
    diffMinutes >= 45 && diffMinutes <= 75,
    `Hanafi Asr offset should be approximately 45-75 minutes (got ${diffMinutes}m)`,
  );
});

// -------------------------------------------------------------
// Suite 3: Next Prayer Selection & Sunrise Separation
// -------------------------------------------------------------
console.log('\n[Suite 3: Next Prayer Selection & Sunrise Exclusion]');

function getNextObligatoryPrayer(todayTimes, tomorrowTimes, now) {
  const nowMs = now.getTime();
  const fajr = todayTimes.fajr.getTime();
  const dhuhr = todayTimes.dhuhr.getTime();
  const asr = todayTimes.asr.getTime();
  const maghrib = todayTimes.maghrib.getTime();
  const isha = todayTimes.isha.getTime();
  const tomorrowFajr = tomorrowTimes.fajr.getTime();

  if (nowMs < fajr) {
    return { name: 'Fajr', time: todayTimes.fajr, isTomorrow: false };
  } else if (nowMs < dhuhr) {
    // Note: Between Fajr and Dhuhr (including during Sunrise), next fard is Dhuhr!
    return { name: 'Dhuhr', time: todayTimes.dhuhr, isTomorrow: false };
  } else if (nowMs < asr) {
    return { name: 'Asr', time: todayTimes.asr, isTomorrow: false };
  } else if (nowMs < maghrib) {
    return { name: 'Maghrib', time: todayTimes.maghrib, isTomorrow: false };
  } else if (nowMs < isha) {
    return { name: 'Isha', time: todayTimes.isha, isTomorrow: false };
  } else {
    return { name: 'Fajr', time: tomorrowTimes.fajr, isTomorrow: true };
  }
}

test('3.1 Between Sunrise and Dhuhr, next prayer is Dhuhr (Sunrise skipped)', () => {
  const coords = new Coordinates(NEW_DELHI.latitude, NEW_DELHI.longitude);
  const params = CalculationMethod.Karachi();
  const todayTimes = new PrayerTimes(coords, testDate, params);
  const tomorrowDate = new Date(2026, 9, 21);
  const tomorrowTimes = new PrayerTimes(coords, tomorrowDate, params);

  // Time: exactly 15 minutes after Sunrise
  const afterSunrise = new Date(todayTimes.sunrise.getTime() + 15 * 60000);
  const next = getNextObligatoryPrayer(todayTimes, tomorrowTimes, afterSunrise);

  assert.strictEqual(next.name, 'Dhuhr', 'Next prayer after sunrise must be Dhuhr');
  assert.strictEqual(next.isTomorrow, false);
});

test('3.2 Early morning before Fajr targets today Fajr', () => {
  const coords = new Coordinates(NEW_DELHI.latitude, NEW_DELHI.longitude);
  const params = CalculationMethod.Karachi();
  const todayTimes = new PrayerTimes(coords, testDate, params);
  const tomorrowDate = new Date(2026, 9, 21);
  const tomorrowTimes = new PrayerTimes(coords, tomorrowDate, params);

  const earlyMorning = new Date(todayTimes.fajr.getTime() - 30 * 60000);
  const next = getNextObligatoryPrayer(todayTimes, tomorrowTimes, earlyMorning);

  assert.strictEqual(next.name, 'Fajr');
  assert.strictEqual(next.isTomorrow, false);
});

// -------------------------------------------------------------
// Suite 4: Midnight Rollover & Post-Isha Countdown
// -------------------------------------------------------------
console.log('\n[Suite 4: Midnight Rollover]');

test('4.1 Post-Isha time targets tomorrow Fajr with positive countdown', () => {
  const coords = new Coordinates(NEW_DELHI.latitude, NEW_DELHI.longitude);
  const params = CalculationMethod.Karachi();
  const todayTimes = new PrayerTimes(coords, testDate, params);
  const tomorrowDate = new Date(2026, 9, 21);
  const tomorrowTimes = new PrayerTimes(coords, tomorrowDate, params);

  // Time: 11:30 PM (after Isha)
  const lateNight = new Date(2026, 9, 20, 23, 30, 0);
  const next = getNextObligatoryPrayer(todayTimes, tomorrowTimes, lateNight);

  assert.strictEqual(next.name, 'Fajr', 'After Isha, next prayer must be Fajr');
  assert.strictEqual(next.isTomorrow, true, 'Next Fajr must be flagged as tomorrow');

  const remainingMs = next.time.getTime() - lateNight.getTime();
  assert(remainingMs > 0, 'Remaining time to tomorrow Fajr must be positive');

  // Should be roughly 5-6 hours
  const hours = remainingMs / 3600000;
  assert(
    hours >= 4 && hours <= 8,
    `Remaining hours should be realistic (got ${hours.toFixed(2)}h)`,
  );
});

// -------------------------------------------------------------
// Suite 5: Fallback Coordinates Validation
// -------------------------------------------------------------
console.log('\n[Suite 5: Fallback Coordinates]');

test('5.1 Fallback coordinates compute valid schedule without NaN', () => {
  const fallback = { latitude: 28.6139, longitude: 77.209 };
  const coords = new Coordinates(fallback.latitude, fallback.longitude);
  const params = CalculationMethod.MuslimWorldLeague();
  const times = new PrayerTimes(coords, new Date(), params);

  assert(!isNaN(times.fajr.getTime()), 'Fajr is valid timestamp');
  assert(!isNaN(times.sunrise.getTime()), 'Sunrise is valid timestamp');
  assert(!isNaN(times.dhuhr.getTime()), 'Dhuhr is valid timestamp');
  assert(!isNaN(times.asr.getTime()), 'Asr is valid timestamp');
  assert(!isNaN(times.maghrib.getTime()), 'Maghrib is valid timestamp');
  assert(!isNaN(times.isha.getTime()), 'Isha is valid timestamp');
});

console.log(`\n=== RESULTS: ${failed === 0 ? 'ALL TESTS PASSED!' : `${failed} FAILED`} ===\n`);
process.exit(failed === 0 ? 0 : 1);
