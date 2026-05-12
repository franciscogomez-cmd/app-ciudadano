import "@/global.css";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { OneSignal } from "react-native-onesignal";
import Toast, { type BaseToastProps } from "react-native-toast-message";
import { StyleSheet, Text, View } from "react-native";

const TOAST_COLORS = {
  success: "#22c55e",
  error:   "#ef4444",
  info:    "#3b82f6",
} as const;

function CustomToast({ type, text1 }: BaseToastProps & { type?: string }) {
  const color = TOAST_COLORS[(type as keyof typeof TOAST_COLORS) ?? "info"] ?? TOAST_COLORS.info;
  return (
    <View style={[styles.toast, { borderLeftColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.text} numberOfLines={2}>{text1}</Text>
    </View>
  );
}

const toastConfig = {
  success: (props: BaseToastProps) => <CustomToast {...props} type="success" />,
  error:   (props: BaseToastProps) => <CustomToast {...props} type="error" />,
  info:    (props: BaseToastProps) => <CustomToast {...props} type="info" />,
};

const styles = StyleSheet.create({
  toast: {
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderLeftWidth: 4,
    backgroundColor: "#1e1e2e",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    minWidth: 200,
    maxWidth: "92%",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    color: "#f1f5f9",
    fontSize: 14,
    fontFamily: "Ubuntu-Medium",
    flexShrink: 1,
  },
});

import { AppConfigProvider, useAppConfig } from "@/context/AppConfigContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { usePermissionSync } from "@/hooks/usePermissionSync";

OneSignal.Debug.setLogLevel(6);
OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? "");

function RootNavigator() {
  const { activeTheme, config, resolvedColorMode } = useAppConfig();
  usePermissionSync();
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
        <Stack.Screen name="tutorial" />
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
      <Toast config={toastConfig} topOffset={60} />
    </GestureHandlerRootView>
  );
}
