import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, G, Polygon } from 'react-native-svg';

interface IsometricKaabaProps {
  size?: number;
}

export function IsometricKaaba({ size = 68 }: IsometricKaabaProps) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <G transform="translate(0, 4)">
          {/* Kaaba Roof (Top Isometric Plane) */}
          <Polygon points="50,14 84,33 50,48 16,33" fill="#1E2320" />
          <Polygon points="50,15 82,33 50,47 18,33" fill="#2B312D" />

          {/* Left Wall (Shadowed) */}
          <Polygon points="16,33 50,48 50,88 16,72" fill="#121614" />

          {/* Right Wall (Direct Light) */}
          <Polygon points="50,48 84,33 84,72 50,88" fill="#1D231F" />

          {/* Kiswah Gold Band - Left Wall */}
          <Polygon points="16,42 50,57 50,62 16,47" fill="#E6BE53" />
          <Polygon points="16,43 50,58 50,60 16,45" fill="#FFF2B2" />

          {/* Kiswah Gold Band - Right Wall */}
          <Polygon points="50,57 84,42 84,47 50,62" fill="#D39A28" />
          <Polygon points="50,58 84,43 84,45 50,60" fill="#F8E37E" />

          {/* Bab-al-Kaaba (Golden Door on Right Wall) */}
          <Polygon points="63,56 71,52 71,73 63,77" fill="#C99324" />
          <Polygon points="64,57 70,54 70,72 64,76" fill="#F2D16B" />

          {/* Hajar al-Aswad (Black Stone corner highlight) */}
          <Circle cx={50} cy={87.5} r={2.2} fill="#CBD5E0" opacity={0.9} />
        </G>
      </Svg>
    </View>
  );
}
