import React from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
} from 'react-native-svg';

interface SplashGoldenEmblemProps {
  size?: number;
}

export function SplashGoldenEmblem({ size = 100 }: SplashGoldenEmblemProps) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg viewBox="0 0 120 120" width={size} height={size}>
        <Defs>
          <LinearGradient id="splashGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFF3C4" />
            <Stop offset="28%" stopColor="#F5D77F" />
            <Stop offset="65%" stopColor="#DEAC42" />
            <Stop offset="100%" stopColor="#9C6E19" />
          </LinearGradient>
        </Defs>

        {/* Elegant Crescent Moon */}
        <Path
          d="M65,12 C96,12 114,39 108,70 C103,96 79,114 51,111 C26,108 8,88 7,63 C6,45 18,28 35,21 C31,35 34,51 44,61 C55,73 72,75 85,67 C89,64 92,60 94,56 C95,49 93,42 89,36 C82,24 72,16 65,12 Z"
          fill="url(#splashGoldGrad)"
        />

        {/* Mosque Silhouettes inside the Moon */}
        {/* Central Dome Base */}
        <Path d="M54,92 L54,73 C54,64 66,64 66,73 L66,92 Z" fill="url(#splashGoldGrad)" />
        {/* Central Minaret Spike */}
        <Line
          x1={60}
          y1={64}
          x2={60}
          y2={58}
          stroke="url(#splashGoldGrad)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {/* Left Minaret */}
        <Rect x={46} y={68} width={4.5} height={24} rx={1} fill="url(#splashGoldGrad)" />
        <Polygon points="48.2,60 45,68 51.5,68" fill="url(#splashGoldGrad)" />
        <Circle cx={48.2} cy={59} r={1.2} fill="url(#splashGoldGrad)" />
        {/* Right Minaret */}
        <Rect x={69.5} y={68} width={4.5} height={24} rx={1} fill="url(#splashGoldGrad)" />
        <Polygon points="71.7,60 68.5,68 75,68" fill="url(#splashGoldGrad)" />
        <Circle cx={71.7} cy={59} r={1.2} fill="url(#splashGoldGrad)" />

        {/* Small Star / Light dot */}
        <Circle cx={86} cy={27} r={3.2} fill="url(#splashGoldGrad)" />
      </Svg>
    </View>
  );
}
