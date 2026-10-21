import { setAudioModeAsync } from 'expo-audio';
import { TasbeehSoundCue } from '../types/tasbeeh.types';

export const STORAGE_KEY_TASBEEH_SOUND = '@islamic_companion_tasbeeh_sound';

/**
 * Minimal interval in milliseconds between consecutive tap audio triggers.
 * Prevents hardware buffer overruns and overlapping during hyper-rapid tapping.
 */
export const MIN_TAP_AUDIO_INTERVAL_MS = 35;

/**
 * Determines which sound cue (if any) should be played upon an increment event.
 *
 * @param nextCount The count after incrementing.
 * @param target The target threshold for the active round.
 * @param soundEnabled Whether the user has enabled tap sound feedback.
 */
export function determineSoundCue(
  nextCount: number,
  target: number,
  soundEnabled: boolean,
): TasbeehSoundCue {
  if (!soundEnabled) {
    return 'none';
  }

  if (target > 0 && nextCount >= target) {
    return 'complete';
  }

  return 'tick';
}

/**
 * Pure evaluator to check whether an incoming tap event should be throttled
 * from triggering the audio engine.
 */
export function shouldThrottleTapAudio(
  lastTapTimeMs: number,
  currentTimeMs: number,
  throttleMs: number = MIN_TAP_AUDIO_INTERVAL_MS,
): boolean {
  if (lastTapTimeMs <= 0) return false;
  return currentTimeMs - lastTapTimeMs < throttleMs;
}

/**
 * Initializes global audio session settings so that subtle prayer clicks
 * do not interrupt background audio (e.g. Quran recitation, adhan, podcasts)
 * and play respectfully even if the device silent ringer is set.
 */
export async function configureTasbeehAudioSession(): Promise<void> {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
    });
  } catch {
    // Non-fatal: fallback to system default session
  }
}
