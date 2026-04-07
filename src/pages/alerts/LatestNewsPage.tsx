import React from 'react';
import { Text, View } from 'react-native';

import { AlertScreenScaffold, DetailCard, RegionMapCard } from '@/components/alerts/AlertsUi';

export function LatestNewsPage() {
  return (
    <AlertScreenScaffold showBackButton title="Ultimas noticias">
      <DetailCard style={{ gap: 16 }}>
        <RegionMapCard />

        <View style={{ gap: 6 }}>
          <Text style={{ color: '#453F3A', fontSize: 15, fontWeight: '800' }}>
            Reporte activo en zona costera
          </Text>
          <Text style={{ color: '#736A63', fontSize: 12, lineHeight: 18 }}>
            Se mantiene monitoreo preventivo por lluvias intensas y riesgo de deslaves. Sigue las
            indicaciones de proteccion civil y evita traslados innecesarios.
          </Text>
        </View>
      </DetailCard>
    </AlertScreenScaffold>
  );
}
