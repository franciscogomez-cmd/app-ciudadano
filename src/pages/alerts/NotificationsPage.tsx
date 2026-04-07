import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import {
  AlertNoticeCard,
  AlertScreenScaffold,
  DetailCard,
  NotificationSwitch,
  useAlertsPalette,
} from '@/components/alerts/AlertsUi';

export function NotificationsPage() {
  const router = useRouter();
  const palette = useAlertsPalette();
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <AlertScreenScaffold showBackButton title="Notificaciones">
      <DetailCard>
        <AlertNoticeCard
          color={palette.severity.emergency}
          title="Alerta meteorologica"
          description="Se pronostican lluvias intensas. Mantente resguardado y sigue las alertas."
        />
        <AlertNoticeCard
          color={palette.severity.emergency}
          title="Noticias del clima hoy"
          description="No olvides paraguas ni ropa abrigadora. Hay posibilidad de tormentas."
        />

        <Text style={{ color: '#726962', fontSize: 11, lineHeight: 16 }}>
          Activa las notificaciones para recibir alertas cada vez que ocurra un evento relevante
          cerca de tu ubicacion.
        </Text>

        <NotificationSwitch value={isEnabled} onValueChange={setIsEnabled} />
      </DetailCard>

      <View style={{ gap: 12 }}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/alertas/notificaciones-feed')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            paddingHorizontal: 16,
            paddingVertical: 14,
          }}>
          <Text style={{ color: '#433D38', fontSize: 14, fontWeight: '700' }}>
            Ver bandeja completa
          </Text>
          <Text style={{ color: '#786F67', fontSize: 11, marginTop: 4 }}>
            Abre la vista extendida con alertas, noticias y configuracion visual.
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/alertas/incidente')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            paddingHorizontal: 16,
            paddingVertical: 14,
          }}>
          <Text style={{ color: '#433D38', fontSize: 14, fontWeight: '700' }}>
            Ver incidente con mapa
          </Text>
          <Text style={{ color: '#786F67', fontSize: 11, marginTop: 4 }}>
            Revisa una alerta activa con ubicacion y zonas afectadas.
          </Text>
        </Pressable>
      </View>
    </AlertScreenScaffold>
  );
}
