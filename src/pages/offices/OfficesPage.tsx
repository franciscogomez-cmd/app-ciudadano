import React from 'react';
import { Text, View } from 'react-native';

import { PageContainer } from '@/components/layout/PageContainer';
import { useAppConfig } from '@/context/AppConfigContext';
import { useResponsiveMetrics } from '@/utils/Responsive';

const OFFICES = [
  { name: 'Oficina Centro', address: 'Av. Principal 120, Centro' },
  { name: 'Oficina Norte', address: 'Blvd. Norte 450, Col. Reforma' },
  { name: 'Oficina Sur', address: 'Calle Sur 88, Col. Jardines' },
];

export function OfficesPage() {
  const { activeTheme } = useAppConfig();
  const metrics = useResponsiveMetrics();

  return (
    <PageContainer scroll>
      <Text className="text-3xl font-bold" style={{ color: activeTheme.text }}>
        Oficinas
      </Text>

      <Text className="text-sm" style={{ color: activeTheme.textMuted }}>
        Consulta sucursales disponibles y su ubicacion.
      </Text>

      <View style={{ gap: metrics.gap }}>
        {OFFICES.map((office) => (
          <View
            key={office.name}
            style={{
              backgroundColor: activeTheme.surface,
              borderColor: activeTheme.border,
              borderWidth: 1,
              borderRadius: metrics.cardRadius,
              padding: 16,
              gap: 6,
            }}>
            <Text className="text-base font-semibold" style={{ color: activeTheme.text }}>
              {office.name}
            </Text>
            <Text className="text-sm" style={{ color: activeTheme.textMuted }}>
              {office.address}
            </Text>
          </View>
        ))}
      </View>
    </PageContainer>
  );
}
