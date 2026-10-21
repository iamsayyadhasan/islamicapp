import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CALCULATION_METHOD_OPTIONS,
  DEFAULT_CALCULATION_METHOD,
  DEFAULT_MADHAB,
  MADHAB_OPTIONS,
} from '../data/prayer-calculation-methods';
import { CalculationMethodKey, MadhabKey } from '../types/prayer-times.types';

interface PrayerSettingsContextValue {
  calculationMethod: CalculationMethodKey;
  madhab: MadhabKey;
  isSettingsLoaded: boolean;
  setCalculationMethod: (method: CalculationMethodKey) => Promise<void>;
  setMadhab: (madhab: MadhabKey) => Promise<void>;
}

const STORAGE_KEY_METHOD = '@islamic_companion_calc_method';
const STORAGE_KEY_MADHAB = '@islamic_companion_madhab';

const PrayerSettingsContext = createContext<PrayerSettingsContextValue | undefined>(undefined);

export function PrayerSettingsProvider({ children }: { children: React.ReactNode }) {
  const [calculationMethod, setMethodState] = useState<CalculationMethodKey>(
    DEFAULT_CALCULATION_METHOD,
  );
  const [madhab, setMadhabState] = useState<MadhabKey>(DEFAULT_MADHAB);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState<boolean>(false);

  // Load persisted user preferences on initial launch
  useEffect(() => {
    let isMounted = true;

    async function loadPreferences() {
      try {
        const stored = await AsyncStorage.multiGet([STORAGE_KEY_METHOD, STORAGE_KEY_MADHAB]);
        const storedMethod = stored[0]?.[1] as CalculationMethodKey | null;
        const storedMadhab = stored[1]?.[1] as MadhabKey | null;

        if (isMounted) {
          if (storedMethod && CALCULATION_METHOD_OPTIONS.some((opt) => opt.key === storedMethod)) {
            setMethodState(storedMethod);
          }
          if (storedMadhab && MADHAB_OPTIONS.some((opt) => opt.key === storedMadhab)) {
            setMadhabState(storedMadhab);
          }
          setIsSettingsLoaded(true);
        }
      } catch {
        if (isMounted) {
          setIsSettingsLoaded(true);
        }
      }
    }

    void loadPreferences();

    return () => {
      isMounted = false;
    };
  }, []);

  const setCalculationMethod = useCallback(async (method: CalculationMethodKey) => {
    setMethodState(method);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_METHOD, method);
    } catch {
      // Graceful local state retention
    }
  }, []);

  const setMadhab = useCallback(async (newMadhab: MadhabKey) => {
    setMadhabState(newMadhab);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_MADHAB, newMadhab);
    } catch {
      // Graceful local state retention
    }
  }, []);

  const value: PrayerSettingsContextValue = {
    calculationMethod,
    madhab,
    isSettingsLoaded,
    setCalculationMethod,
    setMadhab,
  };

  return <PrayerSettingsContext.Provider value={value}>{children}</PrayerSettingsContext.Provider>;
}

export function usePrayerSettings(): PrayerSettingsContextValue {
  const context = useContext(PrayerSettingsContext);
  if (!context) {
    throw new Error('usePrayerSettings must be used within a PrayerSettingsProvider');
  }
  return context;
}
