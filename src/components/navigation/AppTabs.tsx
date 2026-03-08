import React from 'react';
import { Platform } from 'react-native';

import AndroidTabs from './AppTabs.android';
import IOSTabs from './AppTabs.ios';
import WebTabs from './AppTabs.web';

export default function AppTabs() {
  if (Platform.OS === 'ios') {
    return <IOSTabs />;
  }

  if (Platform.OS === 'android') {
    return <AndroidTabs />;
  }

  return <WebTabs />;
}
