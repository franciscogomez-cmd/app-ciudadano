import React from 'react';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAppConfig } from '@/context/AppConfigContext';
import { useResponsiveMetrics } from '@/utils/Responsive';

export function BillingPage() {
  const { activeTheme } = useAppConfig();
  const metrics = useResponsiveMetrics();

  return (
    <PageContainer>
      <View className="flex-1" style={{ gap: metrics.gap }}>
        <Text className="text-3xl font-bold" style={{ color: activeTheme.text }}>
          Facturacion
        </Text>

        <Text className="text-sm" style={{ color: activeTheme.textMuted }}>
          Gestiona tus facturas, consulta estatus y descarga CFDI.
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
          <Text className="text-base font-semibold" style={{ color: activeTheme.text }}>
            Modulo de facturacion listo
          </Text>
          <Text className="text-sm" style={{ color: activeTheme.textMuted }}>
            Aqui puedes conectar tus endpoints de facturacion cuando esten disponibles.
          </Text>
        </View>

        <AppButton label="Generar factura" />
        <AppButton label="Ver historial" variant="secondary" />
      </View>
    </PageContainer>
  );
}
