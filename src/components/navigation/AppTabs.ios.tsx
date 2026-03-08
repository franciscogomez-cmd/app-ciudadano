import { NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";
import { View } from "react-native";

import { useAppConfig } from "@/context/AppConfigContext";

export default function AppTabs() {
  const { config, activeTheme } = useAppConfig();
  const iosTabColor = config.tabs.ios.tintColor;

  return (
    <View style={{ flex: 1, backgroundColor: activeTheme.surface }}>
      <NativeTabs
        disableTransparentOnScrollEdge
        tintColor={iosTabColor}
        iconColor={{
          default: iosTabColor,
          selected: iosTabColor,
        }}
        labelStyle={{
          default: {
            color: iosTabColor,
          },
          selected: {
            color: iosTabColor,
          },
        }}
      >
        <NativeTabs.Trigger name="oficinas">
          <NativeTabs.Trigger.Label>Oficinas</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="building.2" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Inicio</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="square.grid.2x2" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="facturacion">
          <NativeTabs.Trigger.Label>Facturacion</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="doc.text" />
        </NativeTabs.Trigger>
      </NativeTabs>
    </View>
  );
}
