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
  cooldownMs = 600,
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

// Rapid flicker out (t=6050) and back in (t=6100, within 600ms cooldown)
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
  currentTimeMs: 6100, // Only 100ms since last trigger (cooldown is 600ms)
});
assert(
  flickerBackIn.shouldTriggerHaptic === false,
  '7.3 Rapid jitter in/out within cooldown window is suppressed',
);

// Normal realignment after cooldown (t=7000, 1000ms later)
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

console.log(
  `\n=== RESULTS: ${failed === 0 ? 'ALL 21 TESTS PASSED!' : `${failed} TESTS FAILED`} ===\n`,
);

process.exit(failed === 0 ? 0 : 1);
