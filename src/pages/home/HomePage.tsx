import React from 'react';
import { Text, View } from 'react-native';

import { BrandLogo } from '@/components/common/BrandLogo';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAppConfig } from '@/context/AppConfigContext';
import { useResponsiveMetrics } from '@/utils/Responsive';

export function HomePage() {
  const { config, activeTheme } = useAppConfig();
  const metrics = useResponsiveMetrics();

  return (
    <PageContainer>
      <View className="flex-1" style={{ gap: metrics.gap }}>
        <View style={{ gap: metrics.gap }}>
          <BrandLogo size={metrics.logoSize} />

          <Text className="text-3xl font-bold" style={{ color: activeTheme.text }}>
            {config.branding.appName}
          </Text>

          <Text className="text-base" style={{ color: activeTheme.textMuted }}>
            Bienvenido al portal ciudadano. Desde aqui puedes navegar a Oficinas y Facturacion.
          </Text>

          <View
            style={{
              backgroundColor: activeTheme.surface,
              borderColor: activeTheme.border,
              borderWidth: 1,
              borderRadius: metrics.cardRadius,
              padding: 16,
              gap: 8,
            }}>
            <Text className="text-sm" style={{ color: activeTheme.text }}>
              - Tab Inicio: informacion general
            </Text>
            <Text className="text-sm" style={{ color: activeTheme.text }}>
              - Tab Oficinas: sucursales y ubicaciones
            </Text>
            <Text className="text-sm" style={{ color: activeTheme.text }}>
              - Tab Facturacion: gestion de facturas
            </Text>
          </View>
        </View>
      </View>
    </PageContainer>
  );
}
