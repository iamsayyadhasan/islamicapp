import React, { useMemo } from 'react';
import Svg, { Circle, G, Line, Polygon, Text as SvgText } from 'react-native-svg';
import { palette } from '@/theme/tokens/colors';

export interface CompassDialFaceProps {
  dialSize: number;
  center: number;
  radius: number;
  isAligned: boolean;
}

export function CompassDialFace({ dialSize, center, radius, isAligned }: CompassDialFaceProps) {
  // Precompute 360-degree radial tick marks (every 5 degrees)
  const ticks = useMemo(() => {
    const items = [];
    const rOuter = radius * 0.94;
    const rMajor = radius * 0.88;
    const rMinor = radius * 0.91;

    for (let deg = 0; deg < 360; deg += 5) {
      const isMajor = deg % 30 === 0;
      const rad = ((deg - 90) * Math.PI) / 180;
      const rInner = isMajor ? rMajor : rMinor;
      const x1 = center + rInner * Math.cos(rad);
      const y1 = center + rInner * Math.sin(rad);
      const x2 = center + rOuter * Math.cos(rad);
      const y2 = center + rOuter * Math.sin(rad);

      items.push({
        key: deg,
        x1,
        y1,
        x2,
        y2,
        isMajor,
      });
    }
    return items;
  }, [center, radius]);

  // Precompute 8-pointed faceted star compass rose
  const roseFacets = useMemo(() => {
    const facets = [];
    const cardinalRadius = radius * 0.68;
    const intercardinalRadius = radius * 0.5;
    const innerRadius = radius * 0.22;

    for (let i = 0; i < 8; i++) {
      const deg = i * 45;
      const isCardinal = i % 2 === 0;
      const tipR = isCardinal ? cardinalRadius : intercardinalRadius;

      const tipRad = ((deg - 90) * Math.PI) / 180;
      const tipX = center + tipR * Math.cos(tipRad);
      const tipY = center + tipR * Math.sin(tipRad);

      const leftRad = ((deg - 22.5 - 90) * Math.PI) / 180;
      const leftX = center + innerRadius * Math.cos(leftRad);
      const leftY = center + innerRadius * Math.sin(leftRad);

      const rightRad = ((deg + 22.5 - 90) * Math.PI) / 180;
      const rightX = center + innerRadius * Math.cos(rightRad);
      const rightY = center + innerRadius * Math.sin(rightRad);

      facets.push({
        key: `rose-${i}`,
        leftPoints: `${center},${center} ${leftX},${leftY} ${tipX},${tipY}`,
        rightPoints: `${center},${center} ${rightX},${rightY} ${tipX},${tipY}`,
      });
    }
    return facets;
  }, [center, radius]);

  return (
    <Svg width={dialSize} height={dialSize} viewBox={`0 0 ${dialSize} ${dialSize}`}>
      {/* Ivory Parchment Disc Background */}
      <Circle
        cx={center}
        cy={center}
        r={radius - 1.5}
        fill={palette.cream[200]}
        stroke={isAligned ? palette.gold[500] : palette.cream[500]}
        strokeWidth={isAligned ? 2.5 : 1.5}
      />

      {/* Concentric Circle Guidelines */}
      <Circle
        cx={center}
        cy={center}
        r={radius * 0.865}
        fill="none"
        stroke={palette.cream[400]}
        strokeWidth={0.8}
      />
      <Circle
        cx={center}
        cy={center}
        r={radius * 0.7}
        fill="none"
        stroke={palette.cream[300]}
        strokeWidth={0.75}
      />
      <Circle
        cx={center}
        cy={center}
        r={radius * 0.44}
        fill="none"
        stroke={palette.cream[300]}
        strokeWidth={0.75}
      />

      {/* Radial Tick Marks */}
      {ticks.map((tick) => (
        <Line
          key={tick.key}
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
          stroke={tick.isMajor ? palette.cream[700] : palette.cream[500]}
          strokeWidth={tick.isMajor ? 1.5 : 1}
          strokeLinecap="round"
        />
      ))}

      {/* Classical Shaded 8-Point Compass Rose */}
      <G opacity={0.85}>
        {roseFacets.map((facet) => (
          <React.Fragment key={facet.key}>
            <Polygon
              points={facet.leftPoints}
              fill={palette.cream[100]}
              stroke={palette.cream[300]}
              strokeWidth={0.5}
            />
            <Polygon
              points={facet.rightPoints}
              fill={palette.cream[400]}
              stroke={palette.cream[500]}
              strokeWidth={0.5}
            />
          </React.Fragment>
        ))}
      </G>

      {/* Cardinal Directions Typography */}
      <SvgText
        x={center}
        y={center - radius * 0.73}
        textAnchor="middle"
        fill={palette.forestGreen[900]}
        fontSize={15}
        fontWeight="bold"
      >
        N
      </SvgText>
      <SvgText
        x={center + radius * 0.76}
        y={center + 5}
        textAnchor="middle"
        fill={palette.cream[700]}
        fontSize={13}
        fontWeight="bold"
      >
        E
      </SvgText>
      <SvgText
        x={center}
        y={center + radius * 0.8}
        textAnchor="middle"
        fill={palette.cream[700]}
        fontSize={13}
        fontWeight="bold"
      >
        S
      </SvgText>
      <SvgText
        x={center - radius * 0.76}
        y={center + 5}
        textAnchor="middle"
        fill={palette.cream[700]}
        fontSize={13}
        fontWeight="bold"
      >
        W
      </SvgText>
    </Svg>
  );
}
