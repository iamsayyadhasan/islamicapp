import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/typography/ThemedText';
import { CalendarScreen } from '@/features/calendar';
import { TasbeehScreen } from '@/features/tasbeeh';
import { useTheme } from '@/theme';

export default function MoreRoute() {
  const [activeTab, setActiveTab] = useState<'tasbeeh' | 'calendar'>('tasbeeh');
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {/* Top Segmented Selector Bar */}
      <View
        style={[
          styles.switcherBar,
          {
            paddingTop: insets.top + 6,
            backgroundColor: isDark ? theme.colors.background.card : '#FAF8F2',
            borderBottomColor: theme.colors.border.subtle,
          },
        ]}
      >
        <View
          style={[
            styles.pillTrack,
            {
              backgroundColor: isDark ? theme.colors.background.secondary : '#EDE8DC',
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.pillSegment,
              activeTab === 'tasbeeh' && {
                backgroundColor: isDark ? theme.colors.brand.primary : '#0A3B2A',
              },
            ]}
            onPress={() => setActiveTab('tasbeeh')}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityLabel="Tasbeeh Counter"
            accessibilityState={{ selected: activeTab === 'tasbeeh' }}
          >
            <ThemedText
              style={[
                styles.pillText,
                {
                  color:
                    activeTab === 'tasbeeh'
                      ? '#FFFFFF'
                      : isDark
                        ? theme.colors.text.secondary
                        : theme.colors.text.primary,
                },
              ]}
              weight={activeTab === 'tasbeeh' ? 'bold' : 'medium'}
            >
              Tasbeeh
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pillSegment,
              activeTab === 'calendar' && {
                backgroundColor: isDark ? theme.colors.brand.primary : '#0A3B2A',
              },
            ]}
            onPress={() => setActiveTab('calendar')}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityLabel="Islamic Calendar"
            accessibilityState={{ selected: activeTab === 'calendar' }}
          >
            <ThemedText
              style={[
                styles.pillText,
                {
                  color:
                    activeTab === 'calendar'
                      ? '#FFFFFF'
                      : isDark
                        ? theme.colors.text.secondary
                        : theme.colors.text.primary,
                },
              ]}
              weight={activeTab === 'calendar' ? 'bold' : 'medium'}
            >
              Calendar
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Screen Mount */}
      <View style={styles.screenContainer}>
        {activeTab === 'tasbeeh' ? (
          <TasbeehScreen edges={['bottom', 'left', 'right']} />
        ) : (
          <CalendarScreen edges={['bottom', 'left', 'right']} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  switcherBar: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  pillTrack: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 3,
  },
  pillSegment: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 12,
    lineHeight: 16,
  },
  screenContainer: {
    flex: 1,
  },
});
