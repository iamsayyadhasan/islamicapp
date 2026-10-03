import React from 'react';
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '@/theme';

export type TextVariant =
  'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption' | 'label' | 'arabic' | 'display';

export type TextColor =
  'primary' | 'secondary' | 'tertiary' | 'brand' | 'gold' | 'inverse' | 'success' | 'error';

export interface ThemedTextProps extends TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  style?: StyleProp<TextStyle>;
}

export function ThemedText({
  children,
  variant = 'body',
  color = 'primary',
  weight,
  align,
  style,
  ...props
}: ThemedTextProps) {
  const { theme } = useTheme();

  const colorMap: Record<TextColor, string> = {
    primary: theme.colors.text.primary,
    secondary: theme.colors.text.secondary,
    tertiary: theme.colors.text.tertiary,
    brand: theme.colors.text.brand,
    gold: theme.colors.text.gold,
    inverse: theme.colors.text.inverse,
    success: theme.colors.status.success,
    error: theme.colors.status.error,
  };

  const variantStyle: TextStyle = styles[variant] || styles.body;
  const computedColor = colorMap[color] || theme.colors.text.primary;
  const computedWeight = weight ? theme.typography.fontWeight[weight] : undefined;

  return (
    <Text
      style={[
        variantStyle,
        { color: computedColor },
        computedWeight ? { fontWeight: computedWeight } : undefined,
        align ? { textAlign: align } : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
  h1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  },
  h2: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  arabic: {
    fontSize: 22,
    lineHeight: 36,
    fontWeight: '400',
    textAlign: 'right',
  },
});
