import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Svg, { Line, Polyline } from 'react-native-svg';
import { ThemedText } from '@/components/typography/ThemedText';
import { useTheme } from '@/theme';
import { MADHAB_OPTIONS } from '../data/prayer-calculation-methods';
import { MadhabKey } from '../types/prayer-times.types';

export interface MadhabModalProps {
  visible: boolean;
  selectedMadhab: MadhabKey;
  onSelectMadhab: (madhab: MadhabKey) => void;
  onClose: () => void;
}

export function MadhabModal({
  visible,
  selectedMadhab,
  onSelectMadhab,
  onClose,
}: MadhabModalProps) {
  const { theme, isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: theme.colors.background.card,
                  borderColor: theme.colors.border.subtle,
                },
              ]}
            >
              {/* Top Handle */}
              <View
                style={[
                  styles.handleIndicator,
                  {
                    backgroundColor: isDark
                      ? theme.colors.border.subtle
                      : theme.colors.border.default,
                  },
                ]}
              />

              {/* Header */}
              <View style={styles.headerRow}>
                <View style={styles.headerTextGroup}>
                  <ThemedText variant="h3" weight="bold">
                    Asr Madhab
                  </ThemedText>
                  <ThemedText variant="caption" color="secondary">
                    Select school of jurisprudence for Asr prayer timing
                  </ThemedText>
                </View>

                <TouchableOpacity
                  style={[
                    styles.closeButton,
                    { backgroundColor: theme.colors.background.secondary },
                  ]}
                  onPress={onClose}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Close madhab selection modal"
                >
                  <Svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={theme.colors.text.primary}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Line x1={18} y1={6} x2={6} y2={18} />
                    <Line x1={6} y1={6} x2={18} y2={18} />
                  </Svg>
                </TouchableOpacity>
              </View>

              {/* Madhab Options */}
              <View style={styles.optionsList}>
                {MADHAB_OPTIONS.map((item) => {
                  const isSelected = item.key === selectedMadhab;

                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={[
                        styles.optionRow,
                        {
                          borderColor: isSelected
                            ? theme.colors.brand.primary
                            : theme.colors.border.subtle,
                          backgroundColor: isSelected
                            ? isDark
                              ? 'rgba(12, 67, 38, 0.35)'
                              : theme.colors.brand.primaryLight
                            : 'transparent',
                        },
                      ]}
                      onPress={() => {
                        onSelectMadhab(item.key);
                        onClose();
                      }}
                      activeOpacity={0.75}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={`${item.label}, ${item.description}`}
                    >
                      <View style={styles.optionTextContainer}>
                        <ThemedText
                          style={[
                            styles.optionTitle,
                            {
                              color: isSelected
                                ? theme.colors.brand.primary
                                : theme.colors.text.primary,
                            },
                          ]}
                          weight={isSelected ? 'bold' : 'medium'}
                        >
                          {item.label}
                        </ThemedText>
                        <ThemedText
                          style={[styles.optionDescription, { color: theme.colors.text.tertiary }]}
                        >
                          {item.description}
                        </ThemedText>
                      </View>

                      {isSelected && (
                        <View
                          style={[
                            styles.checkBadge,
                            { backgroundColor: theme.colors.brand.primary },
                          ]}
                        >
                          <Svg
                            width={14}
                            height={14}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <Polyline points="20 6 9 17 4 12" />
                          </Svg>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 36,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerTextGroup: {
    gap: 2,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    gap: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  optionTextContainer: {
    flex: 1,
    gap: 3,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  optionDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
