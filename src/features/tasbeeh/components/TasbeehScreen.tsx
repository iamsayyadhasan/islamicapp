import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Href, useRouter } from 'expo-router';
import Svg, { Path, Polyline } from 'react-native-svg';
import { IslamicPatternOverlay } from '@/components/illustrations';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';
import { MOCK_DHIKR_ITEMS } from '../data/tasbeeh.mock';
import { DhikrItem, TasbeehTarget } from '../types/tasbeeh.types';
import { SelectedDhikrCard } from './SelectedDhikrCard';
import { TargetSelectorRow } from './TargetSelectorRow';
import { TasbeehCounterDial } from './TasbeehCounterDial';

export interface TasbeehScreenProps {
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function TasbeehScreen({
  edges = ['top', 'bottom', 'left', 'right'],
}: TasbeehScreenProps = {}) {
  const router = useRouter();
  const { theme, isDark } = useTheme();

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
      if (nextCount >= target) {
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
        {/* Compact Hero Header (Consistent with Calendar) */}
        <View
          style={[
            styles.heroHeader,
            {
              backgroundColor: isDark ? theme.colors.brand.primaryDark : '#0A3B2A',
              borderRadius: theme.radii.xl,
            },
          ]}
        >
          {/* Subtle Islamic Girih Geometric Overlay */}
          <IslamicPatternOverlay opacity={0.08} />

          {/* Optional Back Button if pushed via Stack */}
          {router.canGoBack() && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Polyline points="15 18 9 12 15 6" />
              </Svg>
            </TouchableOpacity>
          )}

          <View style={styles.headerTextGroup}>
            <ThemedText style={styles.headerTitle} weight="bold">
              Tasbeeh
            </ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Remember Allah, one dhikr at a time
            </ThemedText>
          </View>
        </View>

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
        <View style={styles.controlsRow}>
          {/* Undo Button */}
          <TouchableOpacity
            style={[
              styles.controlButton,
              {
                backgroundColor: theme.colors.background.card,
                borderColor: theme.colors.border.subtle,
                borderRadius: theme.radii.lg,
                opacity: count > 0 ? 1 : 0.5,
              },
            ]}
            onPress={handleUndo}
            disabled={count === 0}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Undo last count"
            accessibilityState={{ disabled: count === 0 }}
          >
            <Svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke={count > 0 ? theme.colors.brand.primary : theme.colors.text.tertiary}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M9 14L4 9l5-5" />
              <Path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
            </Svg>
            <ThemedText
              variant="bodySmall"
              weight="medium"
              style={{
                color: count > 0 ? theme.colors.text.primary : theme.colors.text.tertiary,
              }}
            >
              Undo
            </ThemedText>
          </TouchableOpacity>

          {/* Reset Button */}
          <TouchableOpacity
            style={[
              styles.controlButton,
              {
                backgroundColor: theme.colors.background.card,
                borderColor: theme.colors.border.subtle,
                borderRadius: theme.radii.lg,
              },
            ]}
            onPress={handleReset}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Reset counter to zero"
          >
            <Svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.colors.status.error}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </Svg>
            <ThemedText
              variant="bodySmall"
              weight="medium"
              style={{ color: theme.colors.status.error }}
            >
              Reset
            </ThemedText>
          </TouchableOpacity>
        </View>

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
    paddingBottom: 28,
  },
  heroHeader: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
    shadowColor: '#0A3B2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  backButton: {
    position: 'absolute',
    left: 14,
    top: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  headerTextGroup: {
    alignItems: 'center',
    gap: 4,
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 24,
    lineHeight: 30,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: '#FBE19A', // Islamic Warm Gold
    letterSpacing: 0.3,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginVertical: 10,
  },
  controlButton: {
    flex: 1,
    height: 48, // Accessible touch target size >= 44
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
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
