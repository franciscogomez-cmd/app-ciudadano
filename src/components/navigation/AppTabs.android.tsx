import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { useAppConfig } from '@/context/AppConfigContext';

export default function AppTabs() {
  const { activeTheme } = useAppConfig();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeTheme.primary,
        tabBarInactiveTintColor: activeTheme.textMuted,
        sceneStyle: {
          backgroundColor: activeTheme.background,
        },
        tabBarStyle: {
          backgroundColor: activeTheme.surface,
          borderTopColor: activeTheme.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="oficinas"
        options={{
          title: 'Oficinas',
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="business-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="facturacion"
        options={{
          title: 'Facturacion',
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="receipt-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
