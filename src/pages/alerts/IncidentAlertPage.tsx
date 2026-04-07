import React from 'react';
import { Text, View } from 'react-native';

import {
  AlertHistoryCard,
  AlertScreenScaffold,
  DetailCard,
  IncidentMapPreview,
} from '@/components/alerts/AlertsUi';

export function IncidentAlertPage() {
  return (
    <AlertScreenScaffold showBackButton title="Notificaciones">
      <DetailCard style={{ gap: 14 }}>
        <AlertHistoryCard
          title="Cierre vial por inundacion"
          date="5 de marzo 2026 12:53 a.m."
          backgroundColor="#FFD338"
          textColor="#6E5718"
        />

        <AlertHistoryCard
          title="Cierre vial por inundacion"
          date="STATUS: ACTIVA | 5 de marzo 2026 10:53 a.m."
          backgroundColor="#E01D24"
          textColor="#FFFFFF"
        />

        <Text style={{ color: '#756C66', fontSize: 11, lineHeight: 16 }}>
          Debido a inundaciones provocadas por las lluvias recientes, se cerraron las siguientes
          calles y se mantienen operativos preventivos.
        </Text>

        <IncidentMapPreview />

        <View style={{ gap: 6 }}>
          <Text style={{ color: '#7C736C', fontSize: 11 }}>Evita la zona</Text>
          <Text style={{ color: '#413B36', fontSize: 12, fontWeight: '700' }}>
            Ultima hora lluvia intensa
          </Text>
          <Text style={{ color: '#756C66', fontSize: 11, lineHeight: 16 }}>
            Zonas afectadas: Col. Morelos, Centro, Lindavista y Av. Mexico. Mantente informado y
            utiliza rutas alternas.
          </Text>
        </View>
      </DetailCard>
    </AlertScreenScaffold>
  );
}
