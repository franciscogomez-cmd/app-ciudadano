import { Stack } from "expo-router";
import React from "react";

import { useAlertsPalette } from "@/components/alerts/AlertsUi";
import { useAppConfig } from "@/context/AppConfigContext";

export default function AlertsLayout() {
  const { activeTheme } = useAppConfig();
  const palette = useAlertsPalette();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: palette.shellBackground ?? activeTheme.background,
        },
      }}
    />
  );
}
