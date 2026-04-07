import React from 'react';
import { Href, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AlertsFontFamily, AlertsIconName, useAlertsPalette } from '@/components/alerts/AlertsUi';

type AlertFeatureCardProps = {
  icon: AlertsIconName;
  label: string;
  route: Href;
};

function AlertFeatureCard({ icon, label, route }: AlertFeatureCardProps) {
  const router = useRouter();
  const palette = useAlertsPalette();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(route)}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: 198,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 18,
        shadowColor: '#9B9D9A',
        shadowOpacity: 0.2,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5,
        opacity: pressed ? 0.92 : 1,
      })}>
      <MaterialCommunityIcons name={icon} size={82} color={palette.tileIcon} />
      <Text
        style={{
          color: palette.tileText,
          fontFamily: AlertsFontFamily.bold,
          fontSize: 18,
          textAlign: 'center',
        }}>
        {label}
      </Text>
    </Pressable>
  );
}

function AlertActionButton({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  const palette = useAlertsPalette();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 64,
        borderRadius: 16,
        backgroundColor: palette.actionBackground,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOpacity: 0.22,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 6,
        opacity: pressed ? 0.9 : 1,
      })}>
      <Text
        style={{
          color: palette.actionText,
          fontFamily: AlertsFontFamily.bold,
          fontSize: 17,
        }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function AlertsLandingPage() {
  const router = useRouter();
  const palette = useAlertsPalette();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.shellBackground }}>
      <StatusBar style="light" />

      <View style={{ flex: 1, backgroundColor: palette.shellBackground }}>
        <View
          style={{
            paddingHorizontal: 18,
            paddingTop: 12,
            paddingBottom: 18,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: AlertsFontFamily.bold,
              fontSize: 42,
              lineHeight: 42,
            }}>
            Alertas
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: '#F1E952',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Ionicons name="shield-checkmark" size={24} color="#417543" />
            </View>

            <View>
              <Text
                style={{
                  color: palette.tileIcon,
                  fontFamily: AlertsFontFamily.bold,
                  fontSize: 28,
                  lineHeight: 28,
                }}>
                Nayarit
              </Text>
              <Text
                style={{
                  color: palette.tileIcon,
                  fontFamily: AlertsFontFamily.medium,
                  fontSize: 10,
                }}>
                NUESTRA PASION Y COMPROMISO
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 52,
            borderTopRightRadius: 52,
            paddingHorizontal: 18,
            paddingTop: 24,
            paddingBottom: 24,
            gap: 18,
          }}>
          <View style={{ flexDirection: 'row', gap: 18 }}>
            <AlertFeatureCard
              icon="file-clock-outline"
              label="Historial de alertas"
              route="/alertas/historial"
            />
            <AlertFeatureCard
              icon="bell-badge-outline"
              label="Notificaciones"
              route="/alertas/notificaciones"
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 18 }}>
            <AlertFeatureCard
              icon="chart-bar"
              label="Niveles de severidad"
              route="/alertas/niveles"
            />
            <AlertFeatureCard
              icon="bullhorn-outline"
              label="Ultimas noticias"
              route="/alertas/noticias"
            />
          </View>

          <View
            style={{
              marginTop: 18,
              borderRadius: 20,
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#F0E6DB',
              paddingHorizontal: 18,
              paddingVertical: 18,
              gap: 18,
              shadowColor: '#9B9D9A',
              shadowOpacity: 0.16,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 4,
            }}>
            <Text
              style={{
                color: palette.tileText,
                fontFamily: AlertsFontFamily.bold,
                fontSize: 20,
                lineHeight: 28,
              }}>
              Para recibir alertas, ingresa tu codigo postal o activa tu GPS.
            </Text>

            <AlertActionButton
              label="Usar codigo postal"
              onPress={() => router.push('/alertas/incidente')}
            />
            <AlertActionButton label="Activar GPS" onPress={() => router.push('/alertas/incidente')} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
