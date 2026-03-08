import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { useAppConfig } from '@/context/AppConfigContext';

export default function AppTabs() {
  const { activeTheme, config } = useAppConfig();
  const webTabs = config.tabs.web;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: webTabs.activeForeground,
        tabBarInactiveTintColor: webTabs.inactiveForeground,
        tabBarActiveBackgroundColor: webTabs.activeBackground,
        tabBarInactiveBackgroundColor: webTabs.inactiveBackground,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 2,
        },
        tabBarItemStyle: {
          width: 65,
          height: 45,
          borderRadius: 10,
          marginVertical: 8,
          overflow: 'hidden',
        },
        tabBarStyle: {
          backgroundColor: webTabs.inactiveBackground,
          borderTopColor: activeTheme.border,
          borderTopWidth: 1,
          height: 70,
          paddingHorizontal: 12,
        },
        sceneStyle: {
          backgroundColor: activeTheme.background,
        },
      }}>
      <Tabs.Screen
        name="oficinas"
        options={{
          title: 'Oficinas',
          tabBarIcon: ({ color }) => <Ionicons name="business-outline" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="facturacion"
        options={{
          title: 'Facturacion',
          tabBarIcon: ({ color }) =>
            <Ionicons name="document-text-outline" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
