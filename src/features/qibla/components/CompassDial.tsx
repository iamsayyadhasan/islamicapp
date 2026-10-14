import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, G, Line, Polygon, Polyline, Text as SvgText } from 'react-native-svg';
import { IsometricKaaba } from '@/components/illustrations';
import { palette } from '@/theme/tokens/colors';

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

  // Needle geometry
  const tipNorthY = center - radius * 0.74;
  const waistNorthY = center - radius * 0.12;
  const waistNorthW = radius * 0.055;

  const tipSouthY = center + radius * 0.35;
  const waistSouthY = center + radius * 0.1;
  const waistSouthW = radius * 0.038;

  return (
    <View style={[styles.outerContainer, { width: dialSize, height: dialSize }]}>
      {/* Outer Dial Container */}
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
        {/* Static Base Dial SVG (Disc, Guidelines, Ticks, Compass Rose, Cardinal Labels) */}
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

          {/* Top Direction Indicator (V-notch Chevron at 0°) */}
          <Polyline
            points={`${center - 8},${radius * 0.025} ${center},${radius * 0.08} ${center + 8},${radius * 0.025}`}
            stroke={isAligned ? palette.gold[500] : palette.cream[800]}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>

        {/* Rotating Compass Needle Assembly */}
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
          {/* Subtle Ground Depth Shadow */}
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
  rotatingAssembly: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
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
