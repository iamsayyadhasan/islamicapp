import { Platform, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

export const DEFAULT_ALIGNMENT_TOLERANCE_DEG = 3;
export const HAPTIC_TRIGGER_COOLDOWN_MS = 600;

/**
 * Triggers a short haptic or vibration pulse safely across platforms.
 * Respects platform constraints and catches any hardware / permission errors.
 */
export async function triggerQiblaHapticFeedback(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    try {
      Vibration.vibrate(50);
    } catch {
      // Gracefully ignore if neither is supported
    }
  }
}

export interface AlignmentTransitionInput {
  isAligned: boolean;
  wasAligned: boolean;
  hasEstablishedBaseline: boolean;
  hapticsEnabled: boolean;
  lastTriggerTimeMs: number;
  currentTimeMs: number;
  cooldownMs?: number;
}

export interface AlignmentTransitionResult {
  shouldTriggerHaptic: boolean;
  nextWasAligned: boolean;
  nextHasEstablishedBaseline: boolean;
  nextLastTriggerTimeMs: number;
}

/**
 * Pure state machine evaluator for Qibla alignment transitions.
 * Ensures:
 * 1. Initial screen opening already aligned does NOT trigger vibration (baseline establishment).
 * 2. Entering alignment triggers exactly once.
 * 3. Continuous alignment does not repeat vibration.
 * 4. Leaving alignment resets the trigger lock.
 * 5. Realigning triggers again.
 * 6. Rapid sensor updates within cooldown are debounced.
 * 7. Disabled haptics suppress triggers.
 */
export function evaluateAlignmentTransition({
  isAligned,
  wasAligned,
  hasEstablishedBaseline,
  hapticsEnabled,
  lastTriggerTimeMs,
  currentTimeMs,
  cooldownMs = HAPTIC_TRIGGER_COOLDOWN_MS,
}: AlignmentTransitionInput): AlignmentTransitionResult {
  // 1. Establish baseline without vibration if first reading
  if (!hasEstablishedBaseline) {
    return {
      shouldTriggerHaptic: false,
      nextWasAligned: isAligned,
      nextHasEstablishedBaseline: true,
      nextLastTriggerTimeMs: lastTriggerTimeMs,
    };
  }

  // 2. Currently aligned
  if (isAligned) {
    if (!wasAligned) {
      // Just entered alignment range!
      const isCooledDown = currentTimeMs - lastTriggerTimeMs >= cooldownMs;
      const shouldTrigger = hapticsEnabled && isCooledDown;

      return {
        shouldTriggerHaptic: shouldTrigger,
        nextWasAligned: true,
        nextHasEstablishedBaseline: true,
        nextLastTriggerTimeMs: shouldTrigger ? currentTimeMs : lastTriggerTimeMs,
      };
    }

    // Still aligned: do not repeat vibration
    return {
      shouldTriggerHaptic: false,
      nextWasAligned: true,
      nextHasEstablishedBaseline: true,
      nextLastTriggerTimeMs: lastTriggerTimeMs,
    };
  }

  // 3. User moved out of alignment
  return {
    shouldTriggerHaptic: false,
    nextWasAligned: false,
    nextHasEstablishedBaseline: true,
    nextLastTriggerTimeMs: lastTriggerTimeMs,
  };
}
