import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

import {
    AlertNoticeCard,
    AlertScreenScaffold,
    DetailCard,
    NotificationSwitch,
    useAlertsPalette,
} from "@/components/alerts/AlertsUi";
import {
    AlertaMeteorologicaIcon,
    NoticiasUltimaHoraIcon,
} from "@/components/icons";

export function NotificationsPage() {
  const router = useRouter();
  const palette = useAlertsPalette();
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <AlertScreenScaffold showBackButton title="Notificaciones">
      <DetailCard>
        <AlertNoticeCard
          color={palette.severity.emergency}
          icon={
            <AlertaMeteorologicaIcon
              fillColor={palette.severity.emergency}
              strokeColor={palette.iconOnAccent}
            />
          }
          title="Alerta meteorologica"
          description="Se pronostican lluvias intensas. Mantente resguardado y sigue las alertas."
        />
        <AlertNoticeCard
          color={palette.severity.emergency}
          icon={
            <NoticiasUltimaHoraIcon
              fillColor={palette.severity.emergency}
              strokeColor={palette.iconOnAccent}
            />
          }
          title="Noticias del clima hoy"
          description="No olvides paraguas ni ropa abrigadora. Hay posibilidad de tormentas."
        />

        <Text
          className="font-ubuntu-medium text-[11px] leading-[16px]"
          style={{ color: palette.subtleText }}
        >
          Activa las notificaciones para recibir alertas cada vez que ocurra un
          evento relevante cerca de tu ubicacion.
        </Text>

        <NotificationSwitch value={isEnabled} onValueChange={setIsEnabled} />
      </DetailCard>

      <View className="gap-3">
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/alertas/notificaciones-feed")}
          className="rounded-[18px] px-4 py-[14px]"
          style={{ backgroundColor: palette.cardBackground }}
        >
          <Text
            className="font-ubuntu-bold text-[14px]"
            style={{ color: palette.text }}
          >
            Ver bandeja completa
          </Text>
          <Text
            className="mt-1 font-ubuntu-medium text-[11px]"
            style={{ color: palette.subtleText }}
          >
            Abre la vista extendida con alertas, noticias y configuracion
            visual.
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/alertas/incidente")}
          className="rounded-[18px] px-4 py-[14px]"
          style={{ backgroundColor: palette.cardBackground }}
        >
          <Text
            className="font-ubuntu-bold text-[14px]"
            style={{ color: palette.text }}
          >
            Ver incidente con mapa
          </Text>
          <Text
            className="mt-1 font-ubuntu-medium text-[11px]"
            style={{ color: palette.subtleText }}
          >
            Revisa una alerta activa con ubicacion y zonas afectadas.
          </Text>
        </Pressable>
      </View>
    </AlertScreenScaffold>
  );
}
