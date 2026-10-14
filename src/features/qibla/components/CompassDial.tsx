import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { IsometricKaaba } from '@/components/illustrations';
import { palette } from '@/theme/tokens/colors';
import { CompassDialFace } from './CompassDialFace';
import { CompassNeedle } from './CompassNeedle';

export interface CompassDialProps {
  heading?: number;
  isAligned?: boolean;
  size?: number;
}

export function CompassDial({ heading = 0, isAligned = false, size }: CompassDialProps) {
  const { width } = useWindowDimensions();
  const defaultSize = Math.min(Math.round(width - 48), 336);
  const dialSize = size ?? defaultSize;
  const center = dialSize / 2;
  const radius = dialSize / 2;
  const kaabaSize = Math.round(dialSize * 0.19);

  return (
    <View style={[styles.outerContainer, { width: dialSize, height: dialSize }]}>
      <View
        style={[
          styles.bezel,
          {
            width: dialSize,
            height: dialSize,
            borderRadius: radius,
          },
          isAligned && styles.bezelAligned,
        ]}
      >
        {/* Static Base Dial Face */}
        <CompassDialFace
          dialSize={dialSize}
          center={center}
          radius={radius}
          isAligned={isAligned}
        />

        {/* Rotating Needle Assembly */}
        <CompassNeedle
          dialSize={dialSize}
          center={center}
          radius={radius}
          heading={heading}
          isAligned={isAligned}
        />

        {/* Center Grounded Isometric 3D Kaaba (Always Upright) */}
        <View
          style={[
            styles.kaabaCenter,
            {
              left: center - kaabaSize / 2,
              top: center - kaabaSize / 2,
              width: kaabaSize,
              height: kaabaSize,
            },
          ]}
          pointerEvents="none"
        >
          <View
            style={[
              styles.kaabaShadow,
              {
                width: kaabaSize * 0.72,
                height: kaabaSize * 0.22,
                borderRadius: kaabaSize * 0.11,
              },
            ]}
          />
          <IsometricKaaba size={kaabaSize} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  bezel: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: palette.forestGreen[950],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  bezelAligned: {
    shadowColor: palette.forestGreen[800],
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 6,
  },
  kaabaCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  kaabaShadow: {
    position: 'absolute',
    bottom: 2,
    backgroundColor: 'rgba(10, 59, 42, 0.18)',
  },
});
