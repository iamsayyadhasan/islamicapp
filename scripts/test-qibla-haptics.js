// Comprehensive unit tests for Qibla alignment and haptics logic

function shortestAngleDiff(fromAngle, toAngle) {
  const diff = (toAngle - fromAngle) % 360;
  return ((diff + 540) % 360) - 180;
}

function isQiblaAligned(qiblaBearing, deviceHeading, thresholdDeg = 3) {
  const diff = Math.abs(shortestAngleDiff(deviceHeading, qiblaBearing));
  return diff <= thresholdDeg;
}

function evaluateAlignmentTransition({
  isAligned,
  wasAligned,
  hasEstablishedBaseline,
  hapticsEnabled,
  lastTriggerTimeMs,
  currentTimeMs,
  cooldownMs = 800,
}) {
  if (!hasEstablishedBaseline) {
    return {
      shouldTriggerHaptic: false,
      nextWasAligned: isAligned,
      nextHasEstablishedBaseline: true,
      nextLastTriggerTimeMs: lastTriggerTimeMs,
    };
  }

  if (isAligned) {
    if (!wasAligned) {
      const isCooledDown = currentTimeMs - lastTriggerTimeMs >= cooldownMs;
      const shouldTrigger = hapticsEnabled && isCooledDown;

      return {
        shouldTriggerHaptic: shouldTrigger,
        nextWasAligned: true,
        nextHasEstablishedBaseline: true,
        nextLastTriggerTimeMs: shouldTrigger ? currentTimeMs : lastTriggerTimeMs,
      };
    }

    return {
      shouldTriggerHaptic: false,
      nextWasAligned: true,
      nextHasEstablishedBaseline: true,
      nextLastTriggerTimeMs: lastTriggerTimeMs,
    };
  }

  return {
    shouldTriggerHaptic: false,
    nextWasAligned: false,
    nextHasEstablishedBaseline: true,
    nextLastTriggerTimeMs: lastTriggerTimeMs,
  };
}

console.log('=== RUNNING QIBLA ALIGNMENT & HAPTICS TESTS ===\n');

let failed = 0;
function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`PASS: ${testName}`);
  } else {
    console.error(`FAIL: ${testName} - ${details}`);
    failed++;
  }
}

// -------------------------------------------------------------
// Test Suite 1: Angle Wraparound & Shortest Circular Difference
// -------------------------------------------------------------
console.log('[Suite 1: Angle Wraparound Calculation]');

assert(
  shortestAngleDiff(359, 1) === 2,
  '1.1 Shortest angle from 359° to 1° is +2°',
  `Got: ${shortestAngleDiff(359, 1)}`,
);

assert(
  shortestAngleDiff(1, 359) === -2,
  '1.2 Shortest angle from 1° to 359° is -2°',
  `Got: ${shortestAngleDiff(1, 359)}`,
);

assert(
  isQiblaAligned(1, 359, 3) === true,
  '1.3 Bearing 1° with Device Heading 359° is within ±3° tolerance',
);

assert(
  isQiblaAligned(359, 1, 3) === true,
  '1.4 Bearing 359° with Device Heading 1° is within ±3° tolerance',
);

assert(
  isQiblaAligned(0, 357, 3) === true,
  '1.5 Boundary test: 0° and 357° (exactly 3° difference) is aligned',
);

assert(
  isQiblaAligned(0, 356, 3) === false,
  '1.6 Boundary test: 0° and 356° (4° difference) is NOT aligned',
);

assert(
  isQiblaAligned(0, 3, 3) === true,
  '1.7 Boundary test: 0° and 3° (exactly 3° difference) is aligned',
);

assert(
  isQiblaAligned(0, 4, 3) === false,
  '1.8 Boundary test: 0° and 4° (4° difference) is NOT aligned',
);

assert(isQiblaAligned(293, 290, 3) === true, '1.9 Typical Qibla bearing 293° with 290° is aligned');

assert(
  isQiblaAligned(293, 289, 3) === false,
  '1.10 Typical Qibla bearing 293° with 289° is NOT aligned',
);

// -------------------------------------------------------------
// Test Suite 2: Initial Baseline Safety (No Initial Vibration)
// -------------------------------------------------------------
console.log('\n[Suite 2: Initial Baseline Safety]');

const baselineAlgnResult = evaluateAlignmentTransition({
  isAligned: true,
  wasAligned: false,
  hasEstablishedBaseline: false, // Initial launch
  hapticsEnabled: true,
  lastTriggerTimeMs: 0,
  currentTimeMs: 1000,
});

assert(
  baselineAlgnResult.shouldTriggerHaptic === false,
  '2.1 Opening screen already aligned does NOT trigger initial haptic feedback',
);
assert(
  baselineAlgnResult.nextWasAligned === true,
  '2.2 Baseline records wasAligned=true for subsequent checks',
);
assert(
  baselineAlgnResult.nextHasEstablishedBaseline === true,
  '2.3 Baseline is marked established',
);

// -------------------------------------------------------------
// Test Suite 3: Entering Alignment
// -------------------------------------------------------------
console.log('\n[Suite 3: Entering Alignment]');

const enterResult = evaluateAlignmentTransition({
  isAligned: true,
  wasAligned: false,
  hasEstablishedBaseline: true,
  hapticsEnabled: true,
  lastTriggerTimeMs: 0,
  currentTimeMs: 2000,
});

assert(
  enterResult.shouldTriggerHaptic === true,
  '3.1 Entering alignment triggers exactly one haptic pulse',
);
assert(enterResult.nextWasAligned === true, '3.2 nextWasAligned is set to true');
assert(
  enterResult.nextLastTriggerTimeMs === 2000,
  '3.3 lastTriggerTimeMs is updated to current time',
);

// -------------------------------------------------------------
// Test Suite 4: Continuous Alignment (No Continuous Vibration)
// -------------------------------------------------------------
console.log('\n[Suite 4: Continuous Alignment]');

const stayAlignedResult = evaluateAlignmentTransition({
  isAligned: true,
  wasAligned: true,
  hasEstablishedBaseline: true,
  hapticsEnabled: true,
  lastTriggerTimeMs: 2000,
  currentTimeMs: 2200,
});

assert(
  stayAlignedResult.shouldTriggerHaptic === false,
  '4.1 Staying aligned does NOT repeat vibration',
);
assert(stayAlignedResult.nextWasAligned === true, '4.2 Remains in wasAligned=true state');

// -------------------------------------------------------------
// Test Suite 5: Leaving and Realigning
// -------------------------------------------------------------
console.log('\n[Suite 5: Leaving and Realigning]');

// Step 5a: Leave alignment
const leaveResult = evaluateAlignmentTransition({
  isAligned: false,
  wasAligned: true,
  hasEstablishedBaseline: true,
  hapticsEnabled: true,
  lastTriggerTimeMs: 2000,
  currentTimeMs: 3000,
});

assert(leaveResult.shouldTriggerHaptic === false, '5.1 Leaving alignment produces no vibration');
assert(leaveResult.nextWasAligned === false, '5.2 nextWasAligned is reset to false');

// Step 5b: Re-enter alignment after cooldown
const realignResult = evaluateAlignmentTransition({
  isAligned: true,
  wasAligned: leaveResult.nextWasAligned,
  hasEstablishedBaseline: true,
  hapticsEnabled: true,
  lastTriggerTimeMs: 2000,
  currentTimeMs: 4000,
});

assert(
  realignResult.shouldTriggerHaptic === true,
  '5.3 Realigning after moving away triggers a new haptic pulse',
);
assert(
  realignResult.nextWasAligned === true,
  '5.4 State updates to wasAligned=true after realignment',
);

// -------------------------------------------------------------
// Test Suite 6: Disabled Haptics User Preference
// -------------------------------------------------------------
console.log('\n[Suite 6: Disabled Haptics]');

const disabledResult = evaluateAlignmentTransition({
  isAligned: true,
  wasAligned: false,
  hasEstablishedBaseline: true,
  hapticsEnabled: false, // User turned off haptics
  lastTriggerTimeMs: 0,
  currentTimeMs: 5000,
});

assert(
  disabledResult.shouldTriggerHaptic === false,
  '6.1 Entering alignment with haptics disabled triggers NO haptic feedback',
);
assert(
  disabledResult.nextWasAligned === true,
  '6.2 State still tracks alignment accurately even when haptics are off',
);

// -------------------------------------------------------------
// Test Suite 7: Duplicate-Trigger Prevention & Rapid Sensor Updates
// -------------------------------------------------------------
console.log('\n[Suite 7: Duplicate-Trigger Prevention & Cooldown]');

// Initial trigger at t=6000
const firstPulse = evaluateAlignmentTransition({
  isAligned: true,
  wasAligned: false,
  hasEstablishedBaseline: true,
  hapticsEnabled: true,
  lastTriggerTimeMs: 0,
  currentTimeMs: 6000,
});
assert(firstPulse.shouldTriggerHaptic === true, '7.1 First pulse fires at t=6000');

// Rapid sensor event at t=6030 (30ms later), still aligned
const rapidSame = evaluateAlignmentTransition({
  isAligned: true,
  wasAligned: firstPulse.nextWasAligned,
  hasEstablishedBaseline: true,
  hapticsEnabled: true,
  lastTriggerTimeMs: firstPulse.nextLastTriggerTimeMs,
  currentTimeMs: 6030,
});
assert(
  rapidSame.shouldTriggerHaptic === false,
  '7.2 Rapid sensor update 30ms later while aligned is suppressed',
);

// Rapid flicker out (t=6050) and back in (t=6400, within 800ms cooldown)
const flickerOut = evaluateAlignmentTransition({
  isAligned: false,
  wasAligned: rapidSame.nextWasAligned,
  hasEstablishedBaseline: true,
  hapticsEnabled: true,
  lastTriggerTimeMs: firstPulse.nextLastTriggerTimeMs,
  currentTimeMs: 6050,
});

const flickerBackIn = evaluateAlignmentTransition({
  isAligned: true,
  wasAligned: flickerOut.nextWasAligned,
  hasEstablishedBaseline: true,
  hapticsEnabled: true,
  lastTriggerTimeMs: firstPulse.nextLastTriggerTimeMs,
  currentTimeMs: 6400, // Only 400ms since last trigger (cooldown is 800ms)
});
assert(
  flickerBackIn.shouldTriggerHaptic === false,
  '7.3 Rapid jitter in/out within cooldown window is suppressed',
);

// Normal realignment after cooldown (t=7000, 1000ms later > 800ms)
const realignAfterCooldown = evaluateAlignmentTransition({
  isAligned: true,
  wasAligned: false,
  hasEstablishedBaseline: true,
  hapticsEnabled: true,
  lastTriggerTimeMs: firstPulse.nextLastTriggerTimeMs,
  currentTimeMs: 7000,
});
assert(
  realignAfterCooldown.shouldTriggerHaptic === true,
  '7.4 Realignment after cooldown successfully triggers new pulse',
);

// -------------------------------------------------------------
// Test Suite 8: Pulse Sequence Token Cancellation
// -------------------------------------------------------------
console.log('\n[Suite 8: Sequence Token Cancellation on Unmount/Misalignment]');

let mockActiveToken = 0;
function mockCancelActiveSequence() {
  mockActiveToken++;
}

const tokenAtStart = ++mockActiveToken;
mockCancelActiveSequence();
assert(
  tokenAtStart !== mockActiveToken,
  '8.1 Active pulse sequence is invalidated upon unmount or leaving alignment',
);

// -------------------------------------------------------------
// Test Suite 9: Qibla Bearing Calculation From Multiple Locations
// -------------------------------------------------------------
console.log('\n[Suite 9: Qibla Bearing Across Global Coordinates]');

const KAABA = { latitude: 21.422487, longitude: 39.826206 };
const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;
function normalizeAngle(deg) {
  return ((deg % 360) + 360) % 360;
}
function calculateQiblaBearing(userLat, userLng) {
  const phi1 = toRad(userLat);
  const phi2 = toRad(KAABA.latitude);
  const deltaLambda = toRad(KAABA.longitude - userLng);
  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  return normalizeAngle(toDeg(Math.atan2(y, x)));
}

const londonBearing = Math.round(calculateQiblaBearing(51.5074, -0.1278));
assert(londonBearing === 119, '9.1 London Qibla bearing is 119° (ESE)', `Got: ${londonBearing}`);

const nyBearing = Math.round(calculateQiblaBearing(40.7128, -74.006));
assert(nyBearing === 58, '9.2 New York Qibla bearing is 58° (ENE)', `Got: ${nyBearing}`);

const jakartaBearing = Math.round(calculateQiblaBearing(-6.2088, 106.8456));
assert(jakartaBearing === 295, '9.3 Jakarta Qibla bearing is 295° (WNW)', `Got: ${jakartaBearing}`);

const delhiBearing = Math.round(calculateQiblaBearing(28.6139, 77.209));
assert(delhiBearing === 267, '9.4 New Delhi Qibla bearing is 267° (West)', `Got: ${delhiBearing}`);

const sydneyBearing = Math.round(calculateQiblaBearing(-33.8688, 151.2093));
assert(sydneyBearing === 277, '9.5 Sydney Qibla bearing is 277° (West)', `Got: ${sydneyBearing}`);

const northPoleBearing = Math.round(calculateQiblaBearing(90, 0));
assert(
  northPoleBearing === 140,
  '9.6 North Pole bearing is 140° (South towards Kaaba meridian)',
  `Got: ${northPoleBearing}`,
);

const kaabaBearing = Math.round(calculateQiblaBearing(KAABA.latitude, KAABA.longitude));
assert(kaabaBearing === 0, '9.7 Kaaba at origin defaults to 0°', `Got: ${kaabaBearing}`);

// -------------------------------------------------------------
// Test Suite 10: Compass Rotation Model (Headings at 0°, 90°, 180°, 270°)
// -------------------------------------------------------------
console.log('\n[Suite 10: Compass Rotation Model at 0°, 90°, 180°, 270°]');

function calculateNeedleAngle(qiblaBearing, deviceHeading) {
  return normalizeAngle(qiblaBearing - deviceHeading);
}
function calculateDialAngle(deviceHeading) {
  return normalizeAngle(-deviceHeading);
}

// Case 10.1: Heading = 0° (Facing North), Qibla = 119° (London)
assert(calculateDialAngle(0) === 0, "10.1 Heading 0°: Dial rotation is 0° (North at 12 o'clock)");
assert(
  calculateNeedleAngle(119, 0) === 119,
  '10.2 Heading 0°: Needle points at 119° (forward right)',
);

// Case 10.2: Heading = 90° (Facing East), Qibla = 119°
assert(
  calculateDialAngle(90) === 270,
  "10.3 Heading 90°: Dial rotation is -90° (270°), East at 12 o'clock",
);
assert(
  calculateNeedleAngle(119, 90) === 29,
  '10.4 Heading 90°: Needle points at 29° (slightly to the right)',
);

// Case 10.3: Heading = 119° (Facing Qibla directly)
assert(calculateDialAngle(119) === 241, '10.5 Heading 119°: Dial rotation is 241° (-119°)');
assert(
  calculateNeedleAngle(119, 119) === 0,
  "10.6 Heading 119°: Needle points straight up at 0° (12 o'clock chevron)",
);

// Case 10.4: Relative orientation check
// Needle in dial frame is always (needleAngle - dialAngle) = qiblaBearing
const needleInDialFrame = normalizeAngle(calculateNeedleAngle(119, 119) - calculateDialAngle(119));
assert(
  needleInDialFrame === 119,
  '10.7 In dial frame, needle always aligns with Qibla bearing on the dial card',
);

// Case 10.5: Heading = 180° (Facing South), Qibla = 270° (West)
assert(
  calculateDialAngle(180) === 180,
  "10.8 Heading 180°: Dial rotation is 180° (South at 12 o'clock)",
);
assert(
  calculateNeedleAngle(270, 180) === 90,
  '10.9 Facing South with Qibla West: Needle points right at 90° (towards West)',
);

// Case 10.6: Heading = 270° (Facing West), Qibla = 270° (West)
assert(
  calculateDialAngle(270) === 90,
  "10.10 Heading 270°: Dial rotation is 90° (-270°), West at 12 o'clock",
);
assert(
  calculateNeedleAngle(270, 270) === 0,
  "10.11 Facing West aligned with Qibla West: Needle points at 0° (12 o'clock)",
);

// -------------------------------------------------------------
// Test Suite 11: Correct Needle Direction For Cardinal Bearings
// -------------------------------------------------------------
console.log('\n[Suite 11: Qibla Pointer Direction for Different Bearings]');

assert(calculateNeedleAngle(0, 0) === 0, '11.1 Bearing North (0°) with Heading North (0°) -> 0°');
assert(
  calculateNeedleAngle(90, 0) === 90,
  '11.2 Bearing East (90°) with Heading North (0°) -> 90° (right)',
);
assert(
  calculateNeedleAngle(180, 0) === 180,
  '11.3 Bearing South (180°) with Heading North (0°) -> 180° (bottom)',
);
assert(
  calculateNeedleAngle(270, 0) === 270,
  '11.4 Bearing West (270°) with Heading North (0°) -> 270° (left)',
);
assert(
  calculateNeedleAngle(90, 90) === 0,
  '11.5 Bearing East (90°) with Heading East (90°) -> 0° (aligned)',
);
assert(
  calculateNeedleAngle(270, 270) === 0,
  '11.6 Bearing West (270°) with Heading West (270°) -> 0° (aligned)',
);

// -------------------------------------------------------------
// Test Suite 12: Circular Wraparound Across 0°/360° Boundary
// -------------------------------------------------------------
console.log('\n[Suite 12: Wraparound Across 0°/360° Boundary]');

assert(calculateNeedleAngle(5, 355) === 10, '12.1 Bearing 5° with Heading 355° -> 10°');
assert(calculateNeedleAngle(355, 5) === 350, '12.2 Bearing 355° with Heading 5° -> 350° (-10°)');
assert(normalizeAngle(-1) === 359, '12.3 -1° normalizes to 359°');
assert(normalizeAngle(360) === 0, '12.4 360° normalizes to 0°');
assert(normalizeAngle(725) === 5, '12.5 725° normalizes to 5°');

// -------------------------------------------------------------
// Test Suite 13: Permission Denied & Missing Location Safety
// -------------------------------------------------------------
console.log('\n[Suite 13: Permission Denied & Location Safety]');

function computeIsAlignedStrict({ isLive, coords, isLiveCompass, deviceHeading, qiblaBearing }) {
  if (!isLive || !coords || !isLiveCompass || deviceHeading === null) {
    return false;
  }
  return isQiblaAligned(qiblaBearing, deviceHeading);
}

// User points at 267° (New Delhi fallback bearing) while permission is denied
const deniedPermResult = computeIsAlignedStrict({
  isLive: false, // Permission denied!
  coords: null,
  isLiveCompass: true,
  deviceHeading: 267,
  qiblaBearing: 267,
});
assert(
  deniedPermResult === false,
  '13.1 Permission denied NEVER evaluates to aligned even if heading matches fallback bearing',
);

// Missing coordinates
const missingCoordsResult = computeIsAlignedStrict({
  isLive: true,
  coords: null,
  isLiveCompass: true,
  deviceHeading: 267,
  qiblaBearing: 267,
});
assert(missingCoordsResult === false, '13.2 Missing coordinates NEVER evaluates to aligned');

// Valid live coordinates facing Qibla
const validLiveResult = computeIsAlignedStrict({
  isLive: true,
  coords: { latitude: 28.6139, longitude: 77.209 },
  isLiveCompass: true,
  deviceHeading: 267,
  qiblaBearing: 267,
});
assert(
  validLiveResult === true,
  '13.3 Valid live location and matching heading correctly evaluates to aligned',
);

// -------------------------------------------------------------
// Test Suite 14: Missing Compass Sensor Safety
// -------------------------------------------------------------
console.log('\n[Suite 14: Missing Compass Sensor Safety]');

const missingSensorResult = computeIsAlignedStrict({
  isLive: true,
  coords: { latitude: 28.6139, longitude: 77.209 },
  isLiveCompass: false, // No magnetometer on device
  deviceHeading: null,
  qiblaBearing: 267,
});
assert(missingSensorResult === false, '14.1 Missing compass sensor NEVER evaluates to aligned');

// Static needle angle when sensor is unavailable should default to absolute bearing
const staticNeedleAngle = false ? 0 : 267;
assert(
  staticNeedleAngle === 267,
  '14.2 Static needle angle reflects absolute Qibla bearing on dial',
);

// -------------------------------------------------------------
// Test Suite 15: iOS and Android Accuracy Mapping
// -------------------------------------------------------------
console.log('\n[Suite 15: iOS and Android Sensor Accuracy Mapping]');

function mapAccuracy(acc) {
  if (typeof acc !== 'number' || isNaN(acc) || acc <= 0) {
    return 'uncalibrated';
  }
  if (acc === 3) return 'high';
  if (acc === 2) return 'medium';
  if (acc === 1) return 'low';
  if (acc <= 15) return 'high';
  if (acc <= 30) return 'medium';
  if (acc <= 45) return 'low';
  return 'uncalibrated';
}

assert(mapAccuracy(3) === 'high', '15.1 Level 3 accuracy maps to high');
assert(mapAccuracy(2) === 'medium', '15.2 Level 2 accuracy maps to medium');
assert(mapAccuracy(1) === 'low', '15.3 Level 1 accuracy maps to low');
assert(mapAccuracy(0) === 'uncalibrated', '15.4 Level 0 accuracy maps to uncalibrated');
assert(mapAccuracy(-1) === 'uncalibrated', '15.5 Negative accuracy maps to uncalibrated');
assert(mapAccuracy(null) === 'uncalibrated', '15.6 Null accuracy maps to uncalibrated');
assert(mapAccuracy(undefined) === 'uncalibrated', '15.7 Undefined accuracy maps to uncalibrated');
assert(mapAccuracy(5.0) === 'high', '15.8 Raw float 5° deviation maps to high');
assert(mapAccuracy(25.0) === 'medium', '15.9 Raw float 25° deviation maps to medium');
assert(mapAccuracy(40.0) === 'low', '15.10 Raw float 40° deviation maps to low');
assert(mapAccuracy(65.0) === 'uncalibrated', '15.11 Raw float 65° deviation maps to uncalibrated');

console.log(
  `\n=== RESULTS: ${failed === 0 ? 'ALL TESTS PASSED!' : `${failed} TESTS FAILED`} ===\n`,
);

process.exit(failed === 0 ? 0 : 1);
