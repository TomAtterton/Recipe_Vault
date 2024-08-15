import 'react-native-gesture-handler';

import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { RootNavigator } from '@/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import '../src/theme/unistyles';
import { darkNavigationTheme, lightNavigationTheme } from '@/theme/themes';

SplashScreen.preventAutoHideAsync();

import * as Sentry from '@sentry/react-native';
import UpdateProvider from '@/providers/UpdateProvider';
import { useInitialTheme } from 'react-native-unistyles';
import { useBoundStore } from '@/store';
import { Env } from '@/core/env';
import { initPurchases } from '@/services/purchase';
import { FloatingInputProvider } from '@/providers/FloatingInputProvider';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/utils/promptUtils';
import { clearCache } from '@candlefinance/faster-image';

Sentry.init({
  dsn: Env.SENTRY_DSN,
  debug: false,
  enabled: !__DEV__,
});

const App = () => {
  initPurchases();
  const isDarkMode = useBoundStore((state) => state.darkMode);
  useInitialTheme(isDarkMode ? 'dark' : 'light');
  useEffect(() => {
    clearCache();
  }, []);
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer theme={isDarkMode ? darkNavigationTheme : lightNavigationTheme}>
          <UpdateProvider>
            <FloatingInputProvider>
              <RootNavigator />
            </FloatingInputProvider>
          </UpdateProvider>
          <Toast config={toastConfig} />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Sentry.wrap(App);
