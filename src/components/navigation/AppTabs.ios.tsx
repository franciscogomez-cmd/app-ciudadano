import React from 'react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useAppConfig } from '@/context/AppConfigContext';

export default function AppTabs() {
  const { activeTheme } = useAppConfig();

  return (
    <NativeTabs
      backgroundColor={activeTheme.surface}
      indicatorColor={activeTheme.primary}
      labelStyle={{
        selected: {
          color: activeTheme.text,
        },
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Inicio</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="oficinas">
        <NativeTabs.Trigger.Label>Oficinas</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="facturacion">
        <NativeTabs.Trigger.Label>Facturacion</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
