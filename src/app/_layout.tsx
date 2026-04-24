import "@/global.css";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { OneSignal } from "react-native-onesignal";

import { AppConfigProvider, useAppConfig } from "@/context/AppConfigContext";
import { NotificationProvider } from "@/context/NotificationContext";

OneSignal.Debug.setLogLevel(6);
OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? "");

function RootNavigator() {
  const { activeTheme, config, resolvedColorMode } = useAppConfig();
  const { setColorScheme } = useNativeWindColorScheme();

  useEffect(() => {
    setColorScheme(
      config.theme.colorMode === "system"
        ? resolvedColorMode
        : config.theme.colorMode,
    );
  }, [config.theme.colorMode, resolvedColorMode, setColorScheme]);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(activeTheme.background);
  }, [activeTheme.background]);

  return (
    <>
      <StatusBar style={activeTheme.statusBarStyle} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: activeTheme.background,
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="alertas" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Ubuntu-Regular": require("../../assets/fonts/Ubuntu-R.ttf"),
    "Ubuntu-Medium": require("../../assets/fonts/Ubuntu-M.ttf"),
    "Ubuntu-Bold": require("../../assets/fonts/Ubuntu-B.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppConfigProvider>
        <NotificationProvider>
          <RootNavigator />
        </NotificationProvider>
      </AppConfigProvider>
    </GestureHandlerRootView>
  );
}
