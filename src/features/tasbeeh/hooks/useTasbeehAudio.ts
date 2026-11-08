import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudioPlayer } from 'expo-audio';
import {
  configureTasbeehAudioSession,
  shouldThrottleTapAudio,
  STORAGE_KEY_TASBEEH_SOUND,
} from '../utils/tasbeeh-sound';

// Audio assets statically required for Metro bundler
const TICK_SOUND_ASSET = require('@/assets/sounds/tasbeeh-tick.wav');
const COMPLETE_SOUND_ASSET = require('@/assets/sounds/tasbeeh-complete.wav');

// SSR polyfill for Audio in Node.js environment during static export
if (typeof window === 'undefined' && typeof (globalThis as any).Audio === 'undefined') {
  (globalThis as any).Audio = class {
    currentTime = 0;
    duration = 0;
    preload = '';
    crossOrigin = '';
    ontimeupdate = null;
    play() {
      return Promise.resolve();
    }
    pause() {}
    load() {}
    addEventListener() {}
    removeEventListener() {}
  };
}

export interface UseTasbeehAudioResult {
  soundEnabled: boolean;
  toggleSound: () => void;
  playTapFeedback: (isTargetReached: boolean) => void;
}

/**
 * Custom hook managing subtle audio feedback for Tasbeeh counter taps.
 *
 * Adheres to:
 * - Sound OFF by default.
 * - Rapid tap throttle prevention without sound overlapping or UI lag.
 * - Gentle target completion sound cue.
 * - Automatic resource disposal via Expo's useAudioPlayer.
 */
export function useTasbeehAudio(): UseTasbeehAudioResult {
  // Sound is OFF by default as required
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const lastTapTimeRef = useRef<number>(0);

  // Dedicated single player instances for short click and round completion
  const tickPlayer = useAudioPlayer(TICK_SOUND_ASSET, {
    keepAudioSessionActive: true,
  });

  const completePlayer = useAudioPlayer(COMPLETE_SOUND_ASSET, {
    keepAudioSessionActive: true,
  });

  // Setup non-interrupting audio mode on mount
  useEffect(() => {
    void configureTasbeehAudioSession();
  }, []);

  // Restore persisted sound preference
  useEffect(() => {
    let isMounted = true;

    async function loadPreference() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY_TASBEEH_SOUND);
        if (isMounted && stored !== null) {
          setSoundEnabled(stored === 'true');
        }
      } catch {
        // Fallback to default false
      }
    }

    void loadPreference();

    return () => {
      isMounted = false;
    };
  }, []);

  // Safe audio trigger helper
  const triggerPlayer = useCallback((player: typeof tickPlayer) => {
    try {
      const seekPromise = player.seekTo(0);
      if (seekPromise && typeof seekPromise.catch === 'function') {
        seekPromise.catch(() => {});
      }
      player.play();
    } catch {
      // Gracefully silent on unsupported environments
    }
  }, []);

  // Sound toggle with persistence and subtle feedback upon enabling
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEY_TASBEEH_SOUND, String(next)).catch(() => {});

      if (next) {
        // Provide subtle preview tick when sound is turned on
        triggerPlayer(tickPlayer);
      }
      return next;
    });
  }, [tickPlayer, triggerPlayer]);

  // Main tap feedback handler
  const playTapFeedback = useCallback(
    (isTargetReached: boolean) => {
      if (!soundEnabled) return;

      const now = Date.now();
      if (shouldThrottleTapAudio(lastTapTimeRef.current, now)) {
        return;
      }
      lastTapTimeRef.current = now;

      if (isTargetReached) {
        triggerPlayer(completePlayer);
      } else {
        triggerPlayer(tickPlayer);
      }
    },
    [soundEnabled, tickPlayer, completePlayer, triggerPlayer],
  );

  return {
    soundEnabled,
    toggleSound,
    playTapFeedback,
  };
}
