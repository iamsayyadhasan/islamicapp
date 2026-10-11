import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IsometricKaaba } from '@/components/illustrations';
import { ThemedText } from '@/components/typography/ThemedText';

export interface CompassDialProps {
  heading?: number;
  isAligned?: boolean;
}

export function CompassDial({ heading = 293, isAligned = false }: CompassDialProps) {
  return (
    <View style={styles.outerContainer}>
      {/* Outer Bezel */}
      <View style={[styles.bezel, isAligned && styles.bezelAligned]}>
        {/* Soft Parchment Inner Dial */}
        <View style={styles.innerDial}>
          {/* 360-degree Tick Marks */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {Array.from({ length: 36 }).map((_, i) => {
              const deg = i * 10;
              const isMajor = deg % 30 === 0;
              return (
                <View
                  key={deg}
                  style={[
                    styles.tickSlot,
                    {
                      transform: [{ rotate: `${deg}deg` }],
                    },
                  ]}
                >
                  <View style={[styles.tickMark, isMajor ? styles.tickMajor : styles.tickMinor]} />
                </View>
              );
            })}
          </View>

          {/* Cardinal Directions */}
          <ThemedText style={[styles.cardinalText, styles.cardinalN]} weight="bold">
            N
          </ThemedText>
          <ThemedText style={[styles.cardinalText, styles.cardinalS]} weight="bold">
            S
          </ThemedText>
          <ThemedText style={[styles.cardinalText, styles.cardinalE]} weight="bold">
            E
          </ThemedText>
          <ThemedText style={[styles.cardinalText, styles.cardinalW]} weight="bold">
            W
          </ThemedText>

          {/* Rotating Compass Needle & Center Isometric Kaaba */}
          <View style={[styles.rotatingAssembly, { transform: [{ rotate: `${heading}deg` }] }]}>
            {/* Emerald Pointer Ray */}
            <View style={styles.emeraldRay} />

            {/* North Green Arrowhead */}
            <View style={styles.northArrowHead} />

            {/* South Counter-weight */}
            <View style={styles.southCounterWeight} />

            {/* Central Isometric 3D Kaaba */}
            <View style={styles.kaabaCenter}>
              <IsometricKaaba size={64} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const DIAL_SIZE = 250;

const styles = StyleSheet.create({
  outerContainer: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 14,
  },
  bezel: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    backgroundColor: '#EFE8D6',
    borderWidth: 5,
    borderColor: '#C3B28E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0A2819',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 4,
  },
  bezelAligned: {
    borderColor: '#D4AF37', // Gold ring when aligned with Kaaba
    shadowColor: '#0A3B2A',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  innerDial: {
    width: DIAL_SIZE - 20,
    height: DIAL_SIZE - 20,
    borderRadius: (DIAL_SIZE - 20) / 2,
    backgroundColor: '#FAF7EE',
    borderWidth: 1,
    borderColor: '#DDD0B5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  tickSlot: {
    position: 'absolute',
    left: '50%',
    top: 0,
    marginLeft: -1,
    height: '50%',
    width: 2,
    transformOrigin: 'bottom',
    alignItems: 'center',
  },
  tickMark: {
    borderRadius: 0.5,
  },
  tickMajor: {
    width: 2,
    height: 10,
    backgroundColor: '#827150',
  },
  tickMinor: {
    width: 1,
    height: 5,
    backgroundColor: '#C9BEA7',
  },
  cardinalText: {
    position: 'absolute',
    fontSize: 11,
    color: '#827150',
    letterSpacing: 1,
  },
  cardinalN: {
    top: 10,
  },
  cardinalS: {
    bottom: 10,
  },
  cardinalE: {
    right: 12,
  },
  cardinalW: {
    left: 12,
  },
  rotatingAssembly: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emeraldRay: {
    position: 'absolute',
    top: 14,
    width: 3.5,
    height: 100,
    backgroundColor: '#0A3D2C',
    borderRadius: 2,
  },
  northArrowHead: {
    position: 'absolute',
    top: 4,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#0A3D2C',
  },
  southCounterWeight: {
    position: 'absolute',
    bottom: 14,
    width: 3,
    height: 18,
    backgroundColor: '#C9BEA7',
    borderRadius: 1.5,
    opacity: 0.8,
  },
  kaabaCenter: {
    zIndex: 20,
  },
});
