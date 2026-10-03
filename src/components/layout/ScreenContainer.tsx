import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme';

export interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  withStatusBar?: boolean;
}

export function ScreenContainer({
  children,
  style,
  edges = ['top', 'bottom', 'left', 'right'],
  withStatusBar = true,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();

  const topInset = edges.includes('top') ? insets.top : 0;
  const bottomInset = edges.includes('bottom') ? insets.bottom : 0;
  const leftInset = edges.includes('left') ? insets.left : 0;
  const rightInset = edges.includes('right') ? insets.right : 0;

  const userPaddingTop =
    typeof style?.paddingTop === 'number'
      ? style.paddingTop
      : typeof style?.paddingVertical === 'number'
        ? style.paddingVertical
        : 0;

  const userPaddingBottom =
    typeof style?.paddingBottom === 'number'
      ? style.paddingBottom
      : typeof style?.paddingVertical === 'number'
        ? style.paddingVertical
        : 0;

  const userPaddingLeft =
    typeof style?.paddingLeft === 'number'
      ? style.paddingLeft
      : typeof style?.paddingHorizontal === 'number'
        ? style.paddingHorizontal
        : 0;

  const userPaddingRight =
    typeof style?.paddingRight === 'number'
      ? style.paddingRight
      : typeof style?.paddingHorizontal === 'number'
        ? style.paddingHorizontal
        : 0;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
        style,
        {
          paddingTop: topInset + userPaddingTop,
          paddingBottom: bottomInset + userPaddingBottom,
          paddingLeft: leftInset + userPaddingLeft,
          paddingRight: rightInset + userPaddingRight,
        },
      ]}
    >
      {withStatusBar && <StatusBar style={isDark ? 'light' : 'dark'} />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
