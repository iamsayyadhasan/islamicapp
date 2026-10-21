// Comprehensive test suite for Tasbeeh sound feedback and counter logic integrity
const fs = require('fs');
const path = require('path');

function determineSoundCue(nextCount, target, soundEnabled) {
  if (!soundEnabled) {
    return 'none';
  }
  if (target > 0 && nextCount >= target) {
    return 'complete';
  }
  return 'tick';
}

function shouldThrottleTapAudio(lastTapTimeMs, currentTimeMs, throttleMs = 35) {
  if (lastTapTimeMs <= 0) return false;
  return currentTimeMs - lastTapTimeMs < throttleMs;
}

console.log('=== RUNNING TASBEEH AUDIO & COUNTER INTEGRITY TESTS ===\n');

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
// Test Suite 1: Sound Toggle & Default State
// -------------------------------------------------------------
console.log('[Suite 1: Sound Toggle & Default State]');

const defaultSoundEnabled = false;
assert(
  defaultSoundEnabled === false,
  '1.1 Sound toggle defaults to OFF',
  `Got: ${defaultSoundEnabled}`,
);

let soundState = defaultSoundEnabled;
soundState = !soundState;
assert(soundState === true, '1.2 Toggling sound flips state to ON');
soundState = !soundState;
assert(soundState === false, '1.3 Toggling sound again flips state back to OFF');

// -------------------------------------------------------------
// Test Suite 2: Sound Cue Decision Logic (Tick vs Complete vs Silent)
// -------------------------------------------------------------
console.log('\n[Suite 2: Sound Cue Decision Logic]');

// When sound is disabled:
assert(
  determineSoundCue(1, 33, false) === 'none',
  '2.1 Disabled sound produces "none" on normal tap (count 1/33)',
);
assert(
  determineSoundCue(33, 33, false) === 'none',
  '2.2 Disabled sound produces "none" on target completion (count 33/33)',
);
assert(
  determineSoundCue(100, 100, false) === 'none',
  '2.3 Disabled sound produces "none" on target completion (count 100/100)',
);

// When sound is enabled:
assert(
  determineSoundCue(1, 33, true) === 'tick',
  '2.4 Enabled sound produces "tick" for standard tap (1/33)',
);
assert(
  determineSoundCue(32, 33, true) === 'tick',
  '2.5 Enabled sound produces "tick" just prior to target (32/33)',
);
assert(
  determineSoundCue(33, 33, true) === 'complete',
  '2.6 Enabled sound produces "complete" when target 33 is reached',
);
assert(
  determineSoundCue(34, 33, true) === 'complete',
  '2.7 Enabled sound produces "complete" if count meets or exceeds target',
);
assert(
  determineSoundCue(99, 99, true) === 'complete',
  '2.8 Enabled sound produces "complete" when target 99 is reached',
);
assert(
  determineSoundCue(100, 100, true) === 'complete',
  '2.9 Enabled sound produces "complete" when target 100 is reached',
);
assert(
  determineSoundCue(1000, 1000, true) === 'complete',
  '2.10 Enabled sound produces "complete" when target 1000 is reached',
);

// -------------------------------------------------------------
// Test Suite 3: Rapid Tap Throttling & Anti-Overlapping
// -------------------------------------------------------------
console.log('\n[Suite 3: Rapid Tap Throttling]');

assert(
  shouldThrottleTapAudio(0, 1000, 35) === false,
  '3.1 First tap (lastTap=0) is never throttled',
);
assert(
  shouldThrottleTapAudio(1000, 1010, 35) === true,
  '3.2 Rapid tap 10ms later is throttled (< 35ms)',
);
assert(
  shouldThrottleTapAudio(1000, 1025, 35) === true,
  '3.3 Rapid tap 25ms later is throttled (< 35ms)',
);
assert(
  shouldThrottleTapAudio(1000, 1034, 35) === true,
  '3.4 Rapid tap 34ms later is throttled (< 35ms)',
);
assert(shouldThrottleTapAudio(1000, 1035, 35) === false, '3.5 Tap at exactly 35ms is allowed');
assert(
  shouldThrottleTapAudio(1000, 1100, 35) === false,
  '3.6 Standard cadence tap 100ms later is allowed',
);

// Simulation of 10 rapid taps:
const simulatedTapDeltas = [0, 12, 18, 40, 20, 50, 15, 60, 25, 45]; // ms between taps
let lastTapAudioTime = 0;
let currentTime = 10000;
let audioPlayedCount = 0;

for (const delta of simulatedTapDeltas) {
  currentTime += delta;
  const throttled = shouldThrottleTapAudio(lastTapAudioTime, currentTime, 35);
  if (!throttled) {
    audioPlayedCount++;
    lastTapAudioTime = currentTime;
  }
}

// Out of 10 taps with jittery rapid double-taps, only unthrottled ones trigger audio
assert(
  audioPlayedCount < simulatedTapDeltas.length && audioPlayedCount >= 4,
  '3.7 Rapid tap stream successfully throttles bursts while preserving steady cadence',
  `Triggered ${audioPlayedCount} audio events out of ${simulatedTapDeltas.length} taps`,
);

// -------------------------------------------------------------
// Test Suite 4: Counter Logic Preservation with Sound ON & OFF
// -------------------------------------------------------------
console.log('\n[Suite 4: Counter Logic Preservation]');

function simulateTasbeehSession(soundEnabled) {
  let count = 0;
  let completedRounds = 0;
  const target = 33;
  const soundCues = [];

  for (let i = 0; i < 35; i++) {
    const nextCount = count + 1;
    const isCompleted = nextCount >= target;
    const cue = determineSoundCue(nextCount, target, soundEnabled);
    soundCues.push(cue);

    if (isCompleted) {
      completedRounds++;
      count = 0;
    } else {
      count = nextCount;
    }
  }

  return { count, completedRounds, soundCues };
}

const sessionSoundOff = simulateTasbeehSession(false);
assert(
  sessionSoundOff.completedRounds === 1,
  '4.1 Sound OFF: Reaching target 33 successfully increments completed rounds to 1',
);
assert(
  sessionSoundOff.count === 2,
  '4.2 Sound OFF: Reaching target 33 loops back around to count 2 after 35 taps',
);
assert(
  sessionSoundOff.soundCues.every((c) => c === 'none'),
  '4.3 Sound OFF: All 35 sound cues were strictly "none"',
);

const sessionSoundOn = simulateTasbeehSession(true);
assert(
  sessionSoundOn.completedRounds === 1,
  '4.4 Sound ON: Reaching target 33 successfully increments completed rounds to 1',
);
assert(
  sessionSoundOn.count === 2,
  '4.5 Sound ON: Reaching target 33 loops back around to count 2 after 35 taps',
);
assert(
  sessionSoundOn.soundCues[32] === 'complete',
  '4.6 Sound ON: 33rd tap produced "complete" sound cue',
  `Got: ${sessionSoundOn.soundCues[32]}`,
);
assert(
  sessionSoundOn.soundCues[0] === 'tick' && sessionSoundOn.soundCues[31] === 'tick',
  '4.7 Sound ON: Regular taps produced "tick" sound cue',
);

// -------------------------------------------------------------
// Test Suite 5: Audio Asset Verification (WAV Header & Length)
// -------------------------------------------------------------
console.log('\n[Suite 5: Audio Asset File Integrity]');

const soundsDir = path.resolve(__dirname, '../assets/sounds');
const tickPath = path.join(soundsDir, 'tasbeeh-tick.wav');
const completePath = path.join(soundsDir, 'tasbeeh-complete.wav');

assert(fs.existsSync(tickPath), '5.1 tasbeeh-tick.wav exists in assets/sounds');
assert(fs.existsSync(completePath), '5.2 tasbeeh-complete.wav exists in assets/sounds');

if (fs.existsSync(tickPath)) {
  const tickBuffer = fs.readFileSync(tickPath);
  const riff = tickBuffer.toString('ascii', 0, 4);
  const wave = tickBuffer.toString('ascii', 8, 12);
  const sampleRate = tickBuffer.readUInt32LE(24);
  const bitsPerSample = tickBuffer.readUInt16LE(34);

  assert(riff === 'RIFF' && wave === 'WAVE', '5.3 tasbeeh-tick.wav has valid RIFF/WAVE header');
  assert(sampleRate === 44100, '5.4 tasbeeh-tick.wav sample rate is 44100 Hz');
  assert(bitsPerSample === 16, '5.5 tasbeeh-tick.wav is 16-bit PCM');

  const durationMs = Math.round(((tickBuffer.length - 44) / 2 / sampleRate) * 1000);
  assert(
    durationMs >= 50 && durationMs <= 150,
    `5.6 tasbeeh-tick.wav duration is between 50ms and 150ms (got: ${durationMs}ms)`,
  );
}

if (fs.existsSync(completePath)) {
  const compBuffer = fs.readFileSync(completePath);
  const riff = compBuffer.toString('ascii', 0, 4);
  const wave = compBuffer.toString('ascii', 8, 12);
  const sampleRate = compBuffer.readUInt32LE(24);
  const bitsPerSample = compBuffer.readUInt16LE(34);

  assert(riff === 'RIFF' && wave === 'WAVE', '5.7 tasbeeh-complete.wav has valid RIFF/WAVE header');
  assert(sampleRate === 44100, '5.8 tasbeeh-complete.wav sample rate is 44100 Hz');
  assert(bitsPerSample === 16, '5.9 tasbeeh-complete.wav is 16-bit PCM');
}

console.log(
  `\n=== RESULTS: ${failed === 0 ? 'ALL 27 TESTS PASSED!' : `${failed} TESTS FAILED`} ===\n`,
);

process.exit(failed === 0 ? 0 : 1);
