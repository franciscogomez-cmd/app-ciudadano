import React from "react";
import { Text, View } from "react-native";

import {
    AlertScreenScaffold,
    DetailCard,
    RegionMapCard,
    useAlertsPalette,
} from "@/components/alerts/AlertsUi";

export function LatestNewsPage() {
  const palette = useAlertsPalette();

  return (
    <AlertScreenScaffold showBackButton title="Ultimas noticias">
      <DetailCard style={{ gap: 16 }}>
        <RegionMapCard />

        <View className="gap-[6px]">
          <Text
            className="font-ubuntu-bold text-[15px]"
            style={{ color: palette.text }}
          >
            Reporte activo en zona costera
          </Text>
          <Text
            className="font-ubuntu-medium text-[12px] leading-[18px]"
            style={{ color: palette.subtleText }}
          >
            Se mantiene monitoreo preventivo por lluvias intensas y riesgo de
            deslaves. Sigue las indicaciones de proteccion civil y evita
            traslados innecesarios.
          </Text>
        </View>
      </DetailCard>
    </AlertScreenScaffold>
  );
}
