import React from 'react';
import { Text, View } from 'react-native';

import {
  AlertScreenScaffold,
  AlertSeverityItem,
  DetailCard,
  useAlertsPalette,
} from '@/components/alerts/AlertsUi';

export function SeverityLevelsPage() {
  const palette = useAlertsPalette();

  return (
    <AlertScreenScaffold showBackButton title="Niveles de severidad">
      <DetailCard>
        <AlertSeverityItem
          color={palette.severity.preventive}
          title="Preventivo"
          description="Sucede algo que requiere atencion y puede empeorar si no se toman medidas."
        />
        <AlertSeverityItem
          color={palette.severity.emergency}
          title="Emergencia"
          description="Situacion critica o emergencia que requiere atencion inmediata."
        />
        <AlertSeverityItem
          color={palette.severity.informative}
          title="Informativo"
          description="Aviso preventivo para la ciudadania."
        />
      </DetailCard>

      <View style={{ paddingHorizontal: 4 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 12, lineHeight: 18 }}>
          Estos niveles ayudan a priorizar que tan urgente es cada notificacion que recibe la
          ciudadania.
        </Text>
      </View>
    </AlertScreenScaffold>
  );
}
