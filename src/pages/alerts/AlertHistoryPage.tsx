import React from 'react';
import { Text, View } from 'react-native';

import { AlertHistoryCard, AlertScreenScaffold, DetailCard } from '@/components/alerts/AlertsUi';

export function AlertHistoryPage() {
  return (
    <AlertScreenScaffold showBackButton title="Historial de alertas">
      <DetailCard style={{ gap: 14 }}>
        <AlertHistoryCard
          title="Cierre vial por inundacion"
          date="5 de marzo 2026 12:53 a.m."
          backgroundColor="#FFD338"
          textColor="#6E5718"
        />
        <AlertHistoryCard
          title="Mantenimiento vial"
          date="2 de marzo 2026 05:34 p.m."
          backgroundColor="#FFFFFF"
          textColor="#413B36"
        />
        <AlertHistoryCard
          title="Corte de agua programado"
          date="2 de marzo 2026 05:34 p.m."
          backgroundColor="#0E86CD"
          textColor="#FFFFFF"
        />
      </DetailCard>

      <View style={{ paddingHorizontal: 4 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 12, lineHeight: 18 }}>
          Revisa los eventos mas recientes y usa cada tarjeta para abrir el detalle del incidente.
        </Text>
      </View>
    </AlertScreenScaffold>
  );
}
