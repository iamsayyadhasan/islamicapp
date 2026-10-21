import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Href, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';
import { MOCK_DHIKR_ITEMS } from '../data/tasbeeh.mock';
import { useTasbeehAudio } from '../hooks/useTasbeehAudio';
import { DhikrItem, TasbeehTarget } from '../types/tasbeeh.types';
import { SelectedDhikrCard } from './SelectedDhikrCard';
import { TargetSelectorRow } from './TargetSelectorRow';
import { TasbeehCounterDial } from './TasbeehCounterDial';
import { TasbeehHeroHeader } from './TasbeehHeroHeader';
import { TasbeehControlsRow } from './TasbeehControlsRow';

export interface TasbeehScreenProps {
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function TasbeehScreen({
  edges = ['top', 'bottom', 'left', 'right'],
}: TasbeehScreenProps = {}) {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { soundEnabled, toggleSound, playTapFeedback } = useTasbeehAudio();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)' as Href);
    }
  };

  // Local state for counter, target, selected dhikr, and completed rounds
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrItem>(MOCK_DHIKR_ITEMS[0]);
  const [target, setTarget] = useState<TasbeehTarget>(selectedDhikr.defaultTarget);
  const [count, setCount] = useState<number>(0);
  const [completedRounds, setCompletedRounds] = useState<number>(0);

  // Counter Actions
  const handleIncrement = () => {
    setCount((prev) => {
      const nextCount = prev + 1;
      const isCompleted = nextCount >= target;

      // Optional sound feedback (respects sound toggle and throttles rapid taps)
      playTapFeedback(isCompleted);

      // Tactile physical feedback
      if (Platform.OS !== 'web') {
        if (isCompleted) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
      }

      if (isCompleted) {
        setCompletedRounds((r) => r + 1);
        return 0; // Loop around to 0 on reaching target
      }
      return nextCount;
    });
  };

  const handleUndo = () => {
    if (count > 0) {
      setCount((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    if (count === 0 && completedRounds === 0) return;

    Alert.alert(
      'Reset Tasbeeh',
      'Are you sure you want to reset your current count?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setCount(0);
            setCompletedRounds(0);
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleSelectDhikr = (item: DhikrItem) => {
    setSelectedDhikr(item);
    setTarget(item.defaultTarget);
  };

  const handleSelectTarget = (newTarget: TasbeehTarget) => {
    setTarget(newTarget);
    // Does NOT reset the count unexpectedly as per specification
  };

  return (
    <ScreenContainer edges={edges} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TasbeehHeroHeader
          canGoBack={router.canGoBack()}
          onBack={handleBack}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />

        {/* Selected Dhikr Card with Arabic Calligraphy & Switcher */}
        <SelectedDhikrCard selectedDhikr={selectedDhikr} onSelectDhikr={handleSelectDhikr} />

        {/* Visual Focal Point: Main Interactive Counter Dial */}
        <TasbeehCounterDial
          count={count}
          target={target}
          completedRounds={completedRounds}
          onIncrement={handleIncrement}
        />

        {/* Target Goal Selector (33, 99, 100, 1000) */}
        <TargetSelectorRow selectedTarget={target} onSelectTarget={handleSelectTarget} />

        {/* Controls Section: Undo and Reset Action Buttons */}
        <TasbeehControlsRow count={count} onUndo={handleUndo} onReset={handleReset} />

        {/* Bottom Spiritual Reminder Card */}
        <View
          style={[
            styles.reminderCard,
            {
              backgroundColor: isDark ? 'rgba(12, 67, 38, 0.25)' : '#F0F9F3',
              borderColor: isDark ? 'rgba(70, 143, 117, 0.3)' : '#DCEDDE',
              borderRadius: theme.radii.md,
            },
          ]}
        >
          <ThemedText
            variant="caption"
            color="secondary"
            align="center"
            style={styles.reminderText}
          >
            &ldquo;Verily, in the remembrance of Allah do hearts find rest.&rdquo; (13:28)
          </ThemedText>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 72,
  },
  reminderCard: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  reminderText: {
    fontSize: 11,
    lineHeight: 16,
    fontStyle: 'italic',
  },
});
