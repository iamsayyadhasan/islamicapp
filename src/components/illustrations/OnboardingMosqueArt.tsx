import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Polygon, Rect } from 'react-native-svg';

interface OnboardingMosqueArtProps {
  width?: number;
  height?: number;
}

export function OnboardingMosqueArt({ width = 270, height = 220 }: OnboardingMosqueArtProps) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'flex-end' }}>
      {/* Soft Ambient Green Sky Glow */}
      <View
        style={{
          position: 'absolute',
          top: 10,
          width: 220,
          height: 180,
          borderRadius: 90,
          backgroundColor: '#A8D6C3',
          opacity: 0.25,
        }}
      />

      {/* Layered Vector Mosque Landscape */}
      <Svg viewBox="0 0 300 240" width={width} height={height}>
        {/* Flying birds in sky */}
        <Path
          d="M40 32 Q 46 25, 52 30 Q 58 25, 63 32"
          fill="none"
          stroke="#1D5E46"
          strokeWidth={1.6}
          strokeLinecap="round"
          opacity={0.6}
        />
        <Path
          d="M230 42 Q 235 37, 240 41 Q 245 37, 250 42"
          fill="none"
          stroke="#1D5E46"
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.5}
        />
        <Path
          d="M195 55 Q 199 51, 203 54 Q 207 51, 211 55"
          fill="none"
          stroke="#1D5E46"
          strokeWidth={1.4}
          strokeLinecap="round"
          opacity={0.4}
        />

        {/* Background soft hill/tree mounds */}
        <Ellipse cx={60} cy={210} rx={42} ry={24} fill="#A8D6C3" opacity={0.65} />
        <Ellipse cx={240} cy={210} rx={42} ry={24} fill="#A8D6C3" opacity={0.65} />
        <Ellipse cx={150} cy={222} rx={145} ry={22} fill="#589B82" opacity={0.45} />

        {/* Far Left Outer Minaret */}
        <Rect x={74} y={112} width={7} height={96} fill="#2E6B56" rx={2} />
        <Polygon points="77.5,86 72,112 83,112" fill="#1C4B3C" />
        <Circle cx={77.5} cy={84} r={2.2} fill="#F4D381" />
        <Rect x={71.5} y={136} width={12} height={4} rx={1.5} fill="#1A4738" />

        {/* Far Right Outer Minaret */}
        <Rect x={219} y={112} width={7} height={96} fill="#2E6B56" rx={2} />
        <Polygon points="222.5,86 217,112 228,112" fill="#1C4B3C" />
        <Circle cx={222.5} cy={84} r={2.2} fill="#F4D381" />
        <Rect x={216.5} y={136} width={12} height={4} rx={1.5} fill="#1A4738" />

        {/* Main Left Minaret */}
        <Rect x={98} y={82} width={11} height={126} fill="#3B7D66" rx={2} />
        <Polygon points="103.5,54 96,82 111,82" fill="#1F5341" />
        <Circle cx={103.5} cy={51} r={2.8} fill="#F4D381" />
        <Rect x={95} y={110} width={17} height={4.5} rx={1.5} fill="#1C4B3C" />
        <Rect x={95} y={145} width={17} height={4.5} rx={1.5} fill="#1C4B3C" />

        {/* Main Right Minaret */}
        <Rect x={191} y={82} width={11} height={126} fill="#3B7D66" rx={2} />
        <Polygon points="196.5,54 189,82 204,82" fill="#1F5341" />
        <Circle cx={196.5} cy={51} r={2.8} fill="#F4D381" />
        <Rect x={188} y={110} width={17} height={4.5} rx={1.5} fill="#1C4B3C" />
        <Rect x={188} y={145} width={17} height={4.5} rx={1.5} fill="#1C4B3C" />

        {/* Central Base Structure */}
        <Rect x={106} y={146} width={88} height={62} fill="#33705C" rx={3} />

        {/* Left Small Dome */}
        <Path d="M106 146 C106 122 130 122 130 146 Z" fill="#245A48" />
        {/* Right Small Dome */}
        <Path d="M170 146 C170 122 194 122 194 146 Z" fill="#245A48" />

        {/* Central Majestic Grand Dome */}
        <Path d="M117 146 C117 76 183 76 183 146 Z" fill="#468F75" />
        {/* Dome Shading Depth */}
        <Path d="M150 82 C176 84 183 112 183 146 L150 146 Z" fill="#296652" opacity={0.45} />

        {/* Dome Finial & Crescent */}
        <Line
          x1={150}
          y1={78}
          x2={150}
          y2={65}
          stroke="#F4D381"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <Circle cx={150} cy={63} r={3} fill="#F4D381" />
        <Path d="M149 61 C152 60 153 57 150 56 C154 56 155 61 151 62 Z" fill="#F4D381" />

        {/* Mosque Main Arched Gate */}
        <Path d="M138 208 V178 C138 171 162 171 162 178 V208 Z" fill="#FCEAC1" />
        {/* Left window */}
        <Path d="M118 190 V174 C118 169 130 169 130 174 V190 Z" fill="#143C30" />
        {/* Right window */}
        <Path d="M170 190 V174 C170 169 182 169 182 174 V190 Z" fill="#143C30" />

        {/* Fore-hill base with clean curve */}
        <Path d="M20 220 C90 198 210 198 280 220 L300 236 L0 236 Z" fill="#245948" />
      </Svg>
    </View>
  );
}
