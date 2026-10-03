import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import Svg, { Circle, Line, Path, Polygon } from 'react-native-svg';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0A3B2A', // Deep Forest Islamic Green
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FAF8F2',
          borderTopColor: '#E2E8F0',
          height: Platform.OS === 'ios' ? 84 : 62,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 6,
          elevation: 4,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
              <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={color} />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: "Qur'an",
          tabBarIcon: ({ color }) => (
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="qibla"
        options={{
          title: 'Qibla',
          tabBarIcon: ({ color }) => (
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Circle cx={12} cy={12} r={10} />
              <Polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill={color} />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="hadith"
        options={{
          title: 'Hadith',
          tabBarIcon: ({ color }) => (
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => (
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Line x1={4} y1={21} x2={4} y2={14} />
              <Line x1={4} y1={10} x2={4} y2={3} />
              <Line x1={12} y1={21} x2={12} y2={12} />
              <Line x1={12} y1={8} x2={12} y2={3} />
              <Line x1={20} y1={21} x2={20} y2={16} />
              <Line x1={20} y1={12} x2={20} y2={3} />
              <Line x1={1} y1={14} x2={7} y2={14} />
              <Line x1={9} y1={8} x2={15} y2={8} />
              <Line x1={17} y1={16} x2={23} y2={16} />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          href: null, // Accessible via router.push('/(tabs)/prayer')
          title: 'Prayer Times',
        }}
      />
    </Tabs>
  );
}
