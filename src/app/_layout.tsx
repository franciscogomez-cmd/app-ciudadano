import '@/Global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { AppConfigProvider, useAppConfig } from '@/context/AppConfigContext';

function RootNavigator() {
  const { activeTheme } = useAppConfig();

  return (
    <>
      <StatusBar style={activeTheme.statusBarStyle} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: activeTheme.background,
          },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="alertas" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Ubuntu-Regular': require('../../assets/fonts/Ubuntu-R.ttf'),
    'Ubuntu-Medium': require('../../assets/fonts/Ubuntu-M.ttf'),
    'Ubuntu-Bold': require('../../assets/fonts/Ubuntu-B.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppConfigProvider>
      <RootNavigator />
    </AppConfigProvider>
  );
}
