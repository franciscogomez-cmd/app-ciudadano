import React from "react";
import { Text, View } from "react-native";

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
import { useNotifications } from "@/context/NotificationContext";

export function NotificationsFeedPage() {
  const palette = useAlertsPalette();
  const { notifActivas, isLoading, toggleNotifications } = useNotifications();

  return (
    <AlertScreenScaffold showBackButton title="Notificaciones">
      <DetailCard style={{ gap: 14 }}>
        <AlertNoticeCard
          color={palette.severity.emergency}
          icon={
            <AlertaMeteorologicaIcon
              fillColor={palette.severity.emergency}
              strokeColor={palette.iconOnAccent}
            />
          }
          title="Alerta meteorologica"
          description="Se pronostican lluvias intensas. Mantente resguardado y evita zonas de riesgo."
        />

        <Text
          className="font-ubuntu-medium text-[11px] leading-[16px]"
          style={{ color: palette.subtleText }}
        >
          Activa las notificaciones para recibir alertas cada vez que ocurra un
          evento relevante cerca de tu ubicacion.
        </Text>

        <NotificationSwitch
          value={notifActivas}
          disabled={isLoading}
          onValueChange={(enabled) => { void toggleNotifications(enabled); }}
        />
      </DetailCard>

      <DetailCard style={{ gap: 14 }}>
        <AlertNoticeCard
          color={palette.severity.emergency}
          icon={
            <AlertaMeteorologicaIcon
              fillColor={palette.severity.emergency}
              strokeColor={palette.iconOnAccent}
            />
          }
          title="Cierre vial por inundaciones"
          description="Mantente en un lugar seguro y evita cruzar avenidas con flujo alto."
        />

        <AlertNoticeCard
          color={palette.severity.preventive}
          icon={
            <NoticiasUltimaHoraIcon
              fillColor={palette.severity.preventive}
              strokeColor={palette.iconOnAccent}
            />
          }
          title="Noticia de ultima hora"
          description="Corte de agua programado en colonias cercanas durante la madrugada."
        />
      </DetailCard>

      <View className="px-1">
        <Text
          className="font-ubuntu-medium text-[12px] leading-[18px]"
          style={{ color: palette.buttonText }}
        >
          Esta vista concentra la configuracion y el listado de avisos activos
          en una misma pantalla.
        </Text>
      </View>
    </AlertScreenScaffold>
  );
}
