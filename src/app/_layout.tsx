import '@/Global.css';

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
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppConfigProvider>
      <RootNavigator />
    </AppConfigProvider>
  );
}
