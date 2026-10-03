import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';

interface IslamicPatternOverlayProps {
  opacity?: number;
}

export function IslamicPatternOverlay({ opacity = 0.08 }: IslamicPatternOverlayProps) {
  return (
    <View style={[StyleSheet.absoluteFill, { opacity }]} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        {/* Geometric Islamic Girih Pattern Repeats */}
        {[0, 140, 280, 420, 560, 700].map((y) =>
          [0, 140, 280, 420].map((x) => (
            <React.Fragment key={`${x}-${y}`}>
              {/* Central 8-pointed star */}
              <Polygon
                points={`${x + 35},${y + 10} ${x + 42},${y + 23} ${x + 57},${y + 23} ${x + 45},${y + 33} ${x + 49},${y + 48} ${x + 35},${y + 39} ${x + 21},${y + 48} ${x + 25},${y + 33} ${x + 13},${y + 23} ${x + 28},${y + 23}`}
                fill="none"
                stroke="#E5C07B"
                strokeWidth="0.85"
              />
              {/* Outer interlacing geometric straps */}
              <Circle
                cx={x + 35}
                cy={y + 35}
                r={24}
                fill="none"
                stroke="#E5C07B"
                strokeWidth="0.6"
                strokeDasharray="2,2"
              />
              <Line
                x1={x}
                y1={y + 35}
                x2={x + 70}
                y2={y + 35}
                stroke="#E5C07B"
                strokeWidth="0.5"
                opacity={0.6}
              />
              <Line
                x1={x + 35}
                y1={y}
                x2={x + 35}
                y2={y + 70}
                stroke="#E5C07B"
                strokeWidth="0.5"
                opacity={0.6}
              />
              <Line
                x1={x}
                y1={y}
                x2={x + 70}
                y2={y + 70}
                stroke="#E5C07B"
                strokeWidth="0.4"
                opacity={0.4}
              />
              <Line
                x1={x + 70}
                y1={y}
                x2={x}
                y2={y + 70}
                stroke="#E5C07B"
                strokeWidth="0.4"
                opacity={0.4}
              />
              <Polygon
                points={`${x},${y} ${x + 12},${y} ${x + 12},${y + 12} ${x},${y + 12}`}
                fill="none"
                stroke="#E5C07B"
                strokeWidth="0.5"
                opacity={0.5}
              />
              <Polygon
                points={`${x + 70},${y} ${x + 58},${y} ${x + 58},${y + 12} ${x + 70},${y + 12}`}
                fill="none"
                stroke="#E5C07B"
                strokeWidth="0.5"
                opacity={0.5}
              />
              <Polygon
                points={`${x},${y + 70} ${x + 12},${y + 70} ${x + 12},${y + 58} ${x},${y + 58}`}
                fill="none"
                stroke="#E5C07B"
                strokeWidth="0.5"
                opacity={0.5}
              />
              <Polygon
                points={`${x + 70},${y + 70} ${x + 58},${y + 70} ${x + 58},${y + 58} ${x + 70},${y + 58}`}
                fill="none"
                stroke="#E5C07B"
                strokeWidth="0.5"
                opacity={0.5}
              />
            </React.Fragment>
          )),
        )}
      </Svg>
    </View>
  );
}
