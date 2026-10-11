import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';
import { MOCK_ISLAMIC_EVENTS } from '../data/calendar.mock';
import { IslamicEvent } from '../types/calendar.types';

export interface IslamicEventsCardProps {
  currentHijriMonth?: number;
}

export function IslamicEventsCard({ currentHijriMonth }: IslamicEventsCardProps) {
  const { theme, isDark } = useTheme();

  // Highlight events matching or upcoming
  const eventsToShow: IslamicEvent[] = MOCK_ISLAMIC_EVENTS.slice(0, 5);

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.radii.lg,
          padding: theme.spacing.base,
        },
      ]}
    >
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.colors.brand.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Circle cx={12} cy={12} r={10} />
            <Polygon
              points="12 6 15 11 20 11 16 14 18 19 12 16 6 19 8 14 4 11 9 11 12 6"
              fill={theme.colors.brand.primary}
            />
          </Svg>
          <ThemedText variant="h3" weight="bold">
            Key Islamic Events
          </ThemedText>
        </View>

        <View
          style={[
            styles.yearPill,
            {
              backgroundColor: isDark ? 'rgba(12, 67, 38, 0.4)' : theme.colors.brand.primaryLight,
            },
          ]}
        >
          <ThemedText
            style={[styles.yearPillText, { color: theme.colors.brand.primary }]}
            weight="bold"
          >
            1446-1447 AH
          </ThemedText>
        </View>
      </View>

      {/* Events List */}
      <View style={styles.eventsList}>
        {eventsToShow.map((event, idx) => {
          const isLast = idx === eventsToShow.length - 1;

          return (
            <View key={event.id} style={styles.eventItem}>
              <View style={styles.itemTopRow}>
                <View style={styles.eventTextGroup}>
                  <ThemedText variant="bodySmall" weight="bold">
                    {event.name}
                  </ThemedText>
                  {event.description && (
                    <ThemedText variant="caption" color="secondary" style={styles.eventDescription}>
                      {event.description}
                    </ThemedText>
                  )}
                </View>

                {/* Badge Label */}
                <View
                  style={[
                    styles.badge,
                    event.category === 'major'
                      ? {
                          backgroundColor: isDark ? 'rgba(212, 175, 55, 0.2)' : '#FFFBEB',
                          borderColor: 'rgba(212, 175, 55, 0.4)',
                        }
                      : {
                          backgroundColor: isDark ? 'rgba(12, 67, 38, 0.3)' : '#ECFDF5',
                          borderColor: 'rgba(70, 143, 117, 0.3)',
                        },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.badgeText,
                      {
                        color:
                          event.category === 'major'
                            ? theme.colors.text.gold
                            : theme.colors.brand.primary,
                      },
                    ]}
                    weight="medium"
                  >
                    {event.badgeLabel}
                  </ThemedText>
                </View>
              </View>

              {/* Date Metadata Footer */}
              <View style={styles.dateMetaRow}>
                <View style={styles.datePin}>
                  <Svg
                    width={11}
                    height={11}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={theme.colors.text.secondary}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                    <Path d="M16 2v4M8 2v4M3 10h18" />
                  </Svg>
                  <ThemedText variant="caption" color="secondary" style={styles.metaDateText}>
                    {event.hijriDate}
                  </ThemedText>
                </View>

                <ThemedText variant="caption" color="tertiary" style={styles.gregorianDateText}>
                  ({event.gregorianDate})
                </ThemedText>
              </View>

              {!isLast && (
                <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]} />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
    marginTop: 8,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  yearPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  yearPillText: {
    fontSize: 10,
    lineHeight: 14,
    fontVariant: ['tabular-nums'],
  },
  eventsList: {
    gap: 4,
  },
  eventItem: {
    paddingVertical: 8,
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  eventTextGroup: {
    flex: 1,
    gap: 2,
  },
  eventDescription: {
    marginTop: 2,
    lineHeight: 15,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 0.3,
  },
  dateMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  datePin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaDateText: {
    fontSize: 11,
    fontWeight: '500',
  },
  gregorianDateText: {
    fontSize: 10,
  },
  divider: {
    height: 1,
    marginTop: 10,
  },
});
