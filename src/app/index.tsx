import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import {
  getStoredTutorialCompletado,
  getStoredUserId,
  setStoredTutorialCompletado,
} from '@/services/users/UserService';

export default function IndexRoute() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    void (async () => {
      const completado = await getStoredTutorialCompletado();
      if (completado) {
        router.replace('/alertas');
        return;
      }

      // Usuario registrado antes de que existiera el flag → se saltea el tutorial
      const userId = await getStoredUserId();
      if (userId !== null) {
        await setStoredTutorialCompletado();
        router.replace('/alertas');
        return;
      }

      setShowOnboarding(true);
      setChecked(true);
    })();
  }, [router]);

  if (!checked || !showOnboarding) return <View className="flex-1" />;

  return <OnboardingPage />;
}
