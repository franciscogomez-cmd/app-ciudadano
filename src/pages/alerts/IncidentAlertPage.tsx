import React from "react";
import { Text, View } from "react-native";

import {
    AlertHistoryCard,
    AlertScreenScaffold,
    DetailCard,
    IncidentMapPreview,
    useAlertsPalette,
} from "@/components/alerts/AlertsUi";

export function IncidentAlertPage() {
  const palette = useAlertsPalette();

  return (
    <AlertScreenScaffold showBackButton title="Notificaciones">
      <DetailCard style={{ gap: 14 }}>
        <AlertHistoryCard
          title="Cierre vial por inundacion"
          date="5 de marzo 2026 12:53 a.m."
          backgroundColor={palette.severity.preventive}
          textColor={palette.severityText.preventive}
        />

        <AlertHistoryCard
          title="Cierre vial por inundacion"
          date="STATUS: ACTIVA | 5 de marzo 2026 10:53 a.m."
          backgroundColor={palette.severity.emergency}
          textColor={palette.severityText.emergency}
        />

        <Text
          className="font-ubuntu-medium text-[11px] leading-[16px]"
          style={{ color: palette.subtleText }}
        >
          Debido a inundaciones provocadas por las lluvias recientes, se
          cerraron las siguientes calles y se mantienen operativos preventivos.
        </Text>

        <IncidentMapPreview />

        <View className="gap-[6px]">
          <Text
            className="font-ubuntu-medium text-[11px]"
            style={{ color: palette.subtleText }}
          >
            Evita la zona
          </Text>
          <Text
            className="font-ubuntu-bold text-[12px]"
            style={{ color: palette.text }}
          >
            Ultima hora lluvia intensa
          </Text>
          <Text
            className="font-ubuntu-medium text-[11px] leading-[16px]"
            style={{ color: palette.subtleText }}
          >
            Zonas afectadas: Col. Morelos, Centro, Lindavista y Av. Mexico.
            Mantente informado y utiliza rutas alternas.
          </Text>
        </View>
      </DetailCard>
    </AlertScreenScaffold>
  );
}
