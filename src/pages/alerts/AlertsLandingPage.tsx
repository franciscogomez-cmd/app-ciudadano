import { Href, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AlertsFontFamily } from "@/components/alerts/AlertsUi";
import {
  HistorialAlertasIcon,
  NivelesSeguridadIcon,
  NotificacionesIcon,
  UltimasNoticiasIcon,
} from "@/components/icons";

type AlertFeatureCardProps = {
  icon: React.ReactNode;
  label: string;
  route: Href;
};

function AlertFeatureCard({ icon, label, route }: AlertFeatureCardProps) {
  const router = useRouter();

  return (
    // Shadow must live on a plain View — Pressable with function-style `style`
    // doesn't merge className-derived backgroundColor into the layer,
    // so iOS won't render the shadow. Outer View owns the shadow,
    // inner Pressable owns overflow-hidden for rounded clipping.
    <View
      style={{
        flex: 1,
        height: 149,
        borderRadius: 12,
        backgroundColor: "white",
        shadowColor: "#000000",
        shadowOpacity: 0.22,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
      }}
    >
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(route)}
        className="h-[149px] rounded-[12px] bg-white items-center justify-center gap-3 overflow-hidden"
        style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, flex: 1 })}
      >
        <View className="w-[72px] h-[72px] items-center justify-center">
          {icon}
        </View>
        <Text
          className="text-[12px] leading-[20px] text-[#5E595D] text-center"
          style={{ fontFamily: AlertsFontFamily.medium }}
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
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="h-[58px] rounded-[14px] bg-[#2D2B27] items-center justify-center"
      style={({ pressed }) => ({
        opacity: pressed ? 0.88 : 1,
        // shadows cannot be expressed in NativeWind/Tailwind
        shadowColor: "#000000",
        shadowOpacity: 0.28,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
      })}
    >
      <Text
        className="text-white text-[16px] leading-[20px]"
        style={{ fontFamily: AlertsFontFamily.bold }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function AlertsLandingPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#C5B099]">
      <StatusBar style="light" />

      {/* Header */}
      <View
        className="flex-row items-center justify-between px-6 pb-5"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Text
          className="text-white text-[42px]"
          style={{ fontFamily: AlertsFontFamily.bold, lineHeight: 44 }}
        >
          Alertas
        </Text>

        <Image
          source={require("../../../assets/images/logo.png")}
          style={{ width: 170, height: 50 }}
          resizeMode="contain"
        />
      </View>

      {/* Main white card */}
      <View className="flex-1 bg-white rounded-[52px] mb-16 overflow-hidden">
        <View
          className="flex-1 justify-center"
          style={{
            padding: 24,
            gap: 16,
            paddingBottom: Math.max(insets.bottom + 24, 48),
          }}
        >
          {/* Row 1 */}
          <View className="flex-row gap-4">
            <AlertFeatureCard
              icon={<HistorialAlertasIcon size={60} color="#79142A" />}
              label="Historial de alertas"
              route="/alertas/historial"
            />
            <AlertFeatureCard
              icon={<NotificacionesIcon size={60} color="#79142A" />}
              label="Notificaciones"
              route="/alertas/notificaciones"
            />
          </View>

          {/* Row 2 */}
          <View className="flex-row gap-4">
            <AlertFeatureCard
              icon={<NivelesSeguridadIcon size={60} color="#79142A" />}
              label="Niveles de severidad"
              route="/alertas/niveles"
            />
            <AlertFeatureCard
              icon={<UltimasNoticiasIcon size={60} color="#79142A" />}
              label="Últimas noticias"
              route="/alertas/noticias"
            />
          </View>

          {/* GPS card */}
          <View
            className="rounded-[12px] bg-white px-[18px] py-[18px] gap-[14px]"
            style={{
              shadowColor: "#000000",
              shadowOpacity: 0.22,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 5,
            }}
          >
            <Text
              className="text-[15px] leading-[22px] text-[#60595D]"
              style={{ fontFamily: AlertsFontFamily.medium }}
            >
              Para recibir alertas, ingresa tu código postal o activa tu GPS.
            </Text>

            <AlertActionButton
              label="Usar código postal"
              onPress={() => router.push("/alertas/incidente")}
            />
            <AlertActionButton
              label="Activar GPS"
              onPress={() => router.push("/alertas/incidente")}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
