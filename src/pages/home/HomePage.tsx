import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { BrandLogo } from '@/components/common/BrandLogo';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAppConfig } from '@/context/AppConfigContext';
import { getTramites, TramitesModel } from '@/services/pages/TramitesService';
import { useResponsiveMetrics } from '@/utils/Responsive';

export function HomePage() {
  const { config, activeTheme } = useAppConfig();
  const metrics = useResponsiveMetrics();
  const [tramitesData, setTramitesData] = useState<TramitesModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const abortController = new AbortController();

    const loadTramites = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const response = await getTramites({
          page: 1,
          pageSize: 6,
          signal: abortController.signal,
        });

        setTramitesData(response);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        const message = error instanceof Error ? error.message : 'No se pudo cargar tramites.';
        setErrorMessage(message);
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadTramites();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <PageContainer scroll>
      <View className="flex-1" style={{ gap: metrics.gap }}>
        <View style={{ gap: metrics.gap }}>
          <BrandLogo size={metrics.logoSize} />

          <Text className="text-3xl font-bold" style={{ color: activeTheme.text }}>
            {config.branding.appName}
          </Text>

          <Text className="text-base" style={{ color: activeTheme.textMuted }}>
            Bienvenido al portal ciudadano. Estos tramites se cargan desde la API oficial.
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
            <Text className="text-sm" style={{ color: activeTheme.textMuted }}>
              Endpoint: /tramites/plantillas-de-tramites-indexada/
            </Text>

            {isLoading && (
              <View className="flex-row items-center" style={{ gap: 8 }}>
                <ActivityIndicator size="small" color={activeTheme.primary} />
                <Text className="text-sm" style={{ color: activeTheme.text }}>
                  Cargando tramites...
                </Text>
              </View>
            )}

            {!!errorMessage && !isLoading && (
              <Text className="text-sm" style={{ color: activeTheme.secondary }}>
                Error API: {errorMessage}
              </Text>
            )}

            {!!tramitesData && !isLoading && !errorMessage && (
              <>
                <Text className="text-sm font-semibold" style={{ color: activeTheme.text }}>
                  Total de tramites: {tramitesData.total}
                </Text>

                {tramitesData.items.map((tramite) => (
                  <View
                    key={tramite.id}
                    style={{
                      borderColor: activeTheme.border,
                      borderWidth: 1,
                      borderRadius: metrics.cardRadius,
                      padding: 12,
                      gap: 4,
                    }}>
                    <Text className="text-sm font-semibold" style={{ color: activeTheme.text }}>
                      {tramite.name}
                    </Text>
                    <Text className="text-xs" style={{ color: activeTheme.textMuted }}>
                      {tramite.code} | {tramite.isFree ? 'Gratuito' : 'Con costo'} | Consultas:{' '}
                      {tramite.requests}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </View>
        </View>
      </View>
    </PageContainer>
  );
}
