import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/typography/ThemedText';

export interface CompassNeedleProps {
  heading: number;
  qiblaBearing: number;
  isAligned: boolean;
}

export function CompassNeedle({ heading }: CompassNeedleProps) {
  // Needle rotates counter to heading
  const needleRotation = `${-heading}deg`;

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Rotating Compass Needle */}
      <View style={[styles.needleLayer, { transform: [{ rotate: needleRotation }] }]}>
        {/* North Green Needle Pointer */}
        <View style={styles.needleHalfNorth} />
        {/* South Grey Needle Pointer */}
        <View style={styles.needleHalfSouth} />
      </View>

      {/* Kaaba Center 3D Cube Emblem */}
      <View style={styles.kaabaCenterWrapper}>
        <View style={styles.kaabaCube}>
          <View style={styles.kaabaGoldBand} />
          <ThemedText style={styles.kaabaEmoji}>🕋</ThemedText>
        </View>
      </View>
    </View>
  );
}

const NEEDLE_HEIGHT = 90;
const NEEDLE_WIDTH = 16;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  needleLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  needleHalfNorth: {
    position: 'absolute',
    bottom: '50%',
    width: 0,
    height: 0,
    borderLeftWidth: NEEDLE_WIDTH / 2,
    borderRightWidth: NEEDLE_WIDTH / 2,
    borderBottomWidth: NEEDLE_HEIGHT,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#0C4326', // Deep Green Pointer
  },
  needleHalfSouth: {
    position: 'absolute',
    top: '50%',
    width: 0,
    height: 0,
    borderLeftWidth: NEEDLE_WIDTH / 2,
    borderRightWidth: NEEDLE_WIDTH / 2,
    borderTopWidth: NEEDLE_HEIGHT,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#C4D0CA', // Soft Slate/Cream South Pointer
  },
  kaabaCenterWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1E2421',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E6B94D', // Gold Border
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    zIndex: 10,
  },
  kaabaCube: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  kaabaGoldBand: {
    position: 'absolute',
    top: 6,
    width: '100%',
    height: 3,
    backgroundColor: '#E6B94D',
  },
  kaabaEmoji: {
    fontSize: 26,
    lineHeight: 32,
  },
});
