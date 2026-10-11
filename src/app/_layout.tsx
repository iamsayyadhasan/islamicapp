import React, { useEffect } from 'react';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
  Stack,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { ThemeProvider as AppThemeProvider } from '@/theme';

// Prevent the native splash screen from auto-hiding until React root layout is mounted
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Hide the native splash screen immediately when React application mounts
    SplashScreen.hideAsync().catch(() => {
      // Safe fallback if already dismissed
    });
  }, []);

  return (
    <AppThemeProvider>
      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/step-1" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/step-2" options={{ headerShown: false }} />
          <Stack.Screen name="language" options={{ headerShown: false }} />
          <Stack.Screen name="permissions" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="qibla" options={{ headerShown: false }} />
          <Stack.Screen name="tasbeeh" options={{ headerShown: false }} />
        </Stack>
      </NavigationThemeProvider>
    </AppThemeProvider>
  );
}
