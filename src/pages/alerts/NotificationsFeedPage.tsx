import React, { useState } from 'react';
import { Text, View } from 'react-native';

import {
  AlertNoticeCard,
  AlertScreenScaffold,
  DetailCard,
  NotificationSwitch,
  useAlertsPalette,
} from '@/components/alerts/AlertsUi';

export function NotificationsFeedPage() {
  const palette = useAlertsPalette();
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <AlertScreenScaffold showBackButton title="Notificaciones">
      <DetailCard style={{ gap: 14 }}>
        <AlertNoticeCard
          color={palette.severity.emergency}
          title="Alerta meteorologica"
          description="Se pronostican lluvias intensas. Mantente resguardado y evita zonas de riesgo."
        />

        <Text style={{ color: '#726962', fontSize: 11, lineHeight: 16 }}>
          Activa las notificaciones para recibir alertas cada vez que ocurra un evento relevante
          cerca de tu ubicacion.
        </Text>

        <NotificationSwitch value={isEnabled} onValueChange={setIsEnabled} />
      </DetailCard>

      <DetailCard style={{ gap: 14 }}>
        <AlertNoticeCard
          color={palette.severity.emergency}
          title="Cierre vial por inundaciones"
          description="Mantente en un lugar seguro y evita cruzar avenidas con flujo alto."
        />

        <AlertNoticeCard
          color={palette.severity.emergency}
          title="Noticia del ultimo hora"
          description="Corte de agua programado en colonias cercanas durante la madrugada."
        />
      </DetailCard>

      <View style={{ paddingHorizontal: 4 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 12, lineHeight: 18 }}>
          Esta vista concentra la configuracion y el listado de avisos activos en una misma
          pantalla.
        </Text>
      </View>
    </AlertScreenScaffold>
  );
}
