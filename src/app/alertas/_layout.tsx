import { Stack } from 'expo-router';
import React from 'react';

import { useAppConfig } from '@/context/AppConfigContext';

export default function AlertsLayout() {
  const { config } = useAppConfig();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: config.modules.alerts.shellBackground,
        },
      }}
    />
  );
}
