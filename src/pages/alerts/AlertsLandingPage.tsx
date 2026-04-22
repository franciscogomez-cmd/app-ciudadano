import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Href, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAlertsPalette } from "@/components/alerts/AlertsUi";
import {
  HistorialAlertasIcon,
  NivelesSeguridadIcon,
  NotificacionesIcon,
  UltimasNoticiasIcon,
} from "@/components/icons";
import { useAppConfig } from "@/context/AppConfigContext";

type AlertFeatureCardProps = {
  icon: React.ReactNode;
  label: string;
  route: Href;
  backgroundColor: string;
  labelColor: string;
};

function AlertFeatureCard({
  icon,
  label,
  route,
  backgroundColor,
  labelColor,
}: AlertFeatureCardProps) {
  const router = useRouter();
  const palette = useAlertsPalette();

  return (
    <View
      className="flex-1 rounded-[12px]"
      style={{
        height: 149,
        backgroundColor,
        shadowColor: palette.shadowColor,
        shadowOpacity: 0.22,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
      }}
    >
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(route)}
        className="flex-1 items-center justify-center gap-3 overflow-hidden rounded-[12px]"
        style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, flex: 1 })}
      >
        <View className="w-[72px] h-[72px] items-center justify-center">
          {icon}
        </View>
        <Text
          className="text-center font-ubuntu-medium text-[12px] leading-[20px]"
          style={{ color: labelColor }}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

function AlertActionButton({
  label,
  onPress,
  backgroundColor,
  textColor,
}: {
  label: string;
  onPress?: () => void;
  backgroundColor: string;
  textColor: string;
}) {
  const palette = useAlertsPalette();

  return (
    <View
      className="h-[58px] rounded-[14px]"
      style={{
        backgroundColor,
        shadowColor: palette.shadowColor,
        shadowOpacity: 0.28,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
      }}
    >
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        className="flex-1 items-center justify-center rounded-[14px]"
        style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}
      >
        <Text
          className="font-ubuntu-bold text-[16px] leading-[20px]"
          style={{ color: textColor }}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

export function AlertsLandingPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = useAlertsPalette();
  const { activeTheme } = useAppConfig();
  const [locationGranted, setLocationGranted] = useState(false);

  useEffect(() => {
    Location.getForegroundPermissionsAsync().then(({ status }) => {
      setLocationGranted(status === "granted");
    });
  }, []);

  async function handleActivarGps() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationGranted(status === "granted");
  }

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: palette.shellBackground }}
    >
      <StatusBar style={activeTheme.statusBarStyle} />

      <View
        className="flex-row items-center justify-between px-6 pb-5"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Text
          className="font-ubuntu-bold text-[42px] leading-[44px]"
          style={{ color: palette.buttonText }}
        >
          Alertas
        </Text>

        <Image
          source={require("../../../assets/images/logo.png")}
          style={{ width: 170, height: 50 }}
          resizeMode="contain"
        />
      </View>

      <View
        className="mb-16 flex-1 overflow-hidden rounded-[52px]"
        style={{ backgroundColor: palette.cardBackground }}
      >
        <View
          className="flex-1 justify-center"
          style={{
            padding: 24,
            gap: 16,
            paddingBottom: Math.max(insets.bottom + 24, 48),
          }}
        >
          <View className="flex-row gap-4">
            <AlertFeatureCard
              icon={<HistorialAlertasIcon size={60} color={palette.tileIcon} />}
              label="Historial de alertas"
              route="/alertas/historial"
              backgroundColor={palette.cardBackground}
              labelColor={palette.tileText}
            />
            <AlertFeatureCard
              icon={<NotificacionesIcon size={60} color={palette.tileIcon} />}
              label="Notificaciones"
              route="/alertas/notificaciones"
              backgroundColor={palette.cardBackground}
              labelColor={palette.tileText}
            />
          </View>

          <View className="flex-row gap-4">
            <AlertFeatureCard
              icon={<NivelesSeguridadIcon size={60} color={palette.tileIcon} />}
              label="Niveles de severidad"
              route="/alertas/niveles"
              backgroundColor={palette.cardBackground}
              labelColor={palette.tileText}
            />
            <AlertFeatureCard
              icon={<UltimasNoticiasIcon size={60} color={palette.tileIcon} />}
              label="Últimas noticias"
              route="/alertas/noticias"
              backgroundColor={palette.cardBackground}
              labelColor={palette.tileText}
            />
          </View>

          <View
            className="gap-[14px] rounded-[12px] px-[18px] py-[18px]"
            style={{
              backgroundColor: palette.cardBackground,
              shadowColor: palette.shadowColor,
              shadowOpacity: 0.22,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 5,
            }}
          >
            <Text
              className="font-ubuntu-medium text-[15px] leading-[22px]"
              style={{ color: palette.panelText }}
            >
              {locationGranted
                ? "Para recibir alertas, ingresa tu código postal."
                : "Para recibir alertas, ingresa tu código postal o activa tu GPS."}
            </Text>

            <AlertActionButton
              label="Usar código postal"
              backgroundColor={palette.actionBackground}
              textColor={palette.actionText}
              onPress={() => router.push("/alertas/incidente")}
            />
            {!locationGranted && (
              <AlertActionButton
                label="Activar GPS"
                backgroundColor={palette.actionBackground}
                textColor={palette.actionText}
                onPress={handleActivarGps}
              />
            )}
          </View>
        </View>
      </View>

      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          right: 16,
          bottom: Math.max(insets.bottom + 2, 6),
          zIndex: 30,
        }}
      >
        <View
          className="h-[60px] w-[60px] rounded-full"
          style={{
            backgroundColor: palette.actionBackground,
            shadowColor: palette.shadowColor,
            shadowOpacity: 0.24,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 5 },
            elevation: 8,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver onboarding"
            onPress={() => router.push("/")}
            className="flex-1 items-center justify-center rounded-full"
            style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}
          >
            <Ionicons
              name="information-circle-outline"
              size={30}
              color={palette.iconOnAccent}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
