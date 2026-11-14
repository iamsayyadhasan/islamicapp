import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line, Polygon } from 'react-native-svg';
import { palette } from '@/theme/tokens/colors';

export interface CompassNeedleProps {
  dialSize: number;
  center: number;
  radius: number;
  heading: number;
  isAligned: boolean;
}

export function CompassNeedle({
  dialSize,
  center,
  radius,
  heading,
  isAligned,
}: CompassNeedleProps) {
  // Needle geometry
  const tipNorthY = center - radius * 0.74;
  const waistNorthY = center - radius * 0.12;
  const waistNorthW = radius * 0.055;

  const tipSouthY = center + radius * 0.35;
  const waistSouthY = center + radius * 0.1;
  const waistSouthW = radius * 0.038;

  return (
    <View
      style={[
        styles.rotatingAssembly,
        {
          width: dialSize,
          height: dialSize,
          transform: [{ rotate: `${heading}deg` }],
        },
      ]}
      pointerEvents="none"
    >
      <Svg width={dialSize} height={dialSize} viewBox={`0 0 ${dialSize} ${dialSize}`}>
        {/* North Pointer (pointing to Qibla at 0° in rotating frame) */}
        <Polygon
          points={`${center},${tipNorthY} ${center - waistNorthW},${waistNorthY} ${center},${center}`}
          fill={palette.forestGreen[800]}
        />
        <Polygon
          points={`${center},${tipNorthY} ${center + waistNorthW},${waistNorthY} ${center},${center}`}
          fill={palette.forestGreen[500]}
        />
        {/* Center Gold Ridge */}
        <Line
          x1={center}
          y1={tipNorthY}
          x2={center}
          y2={center}
          stroke={palette.gold[400]}
          strokeWidth={1.2}
        />

        {/* South Pointer (Counter-weight) */}
        <Polygon
          points={`${center},${tipSouthY} ${center - waistSouthW},${waistSouthY} ${center},${center}`}
          fill={palette.forestGreen[700]}
        />
        <Polygon
          points={`${center},${tipSouthY} ${center + waistSouthW},${waistSouthY} ${center},${center}`}
          fill={palette.forestGreen[300]}
        />
        <Line
          x1={center}
          y1={center}
          x2={center}
          y2={tipSouthY}
          stroke={palette.cream[600]}
          strokeWidth={0.8}
        />

        {/* Needle Tip Alignment Diamond Highlight */}
        {isAligned && (
          <Polygon
            points={`${center},${tipNorthY - 5} ${center + 5},${tipNorthY} ${center},${tipNorthY + 5} ${center - 5},${tipNorthY}`}
            fill={palette.gold[400]}
          />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  rotatingAssembly: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
