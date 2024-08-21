import 'react-native-gesture-handler';

import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { RootNavigator } from '@/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import '../src/theme/unistyles';
import { darkNavigationTheme } from '@/theme/themes';

SplashScreen.preventAutoHideAsync();

import * as Sentry from '@sentry/react-native';
import UpdateProvider from '@/providers/UpdateProvider';
import { Env } from '@/core/env';
import { initPurchases } from '@/services/purchase';
import { FloatingInputProvider } from '@/providers/FloatingInputProvider';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/utils/promptUtils';
import useHandleSession from '@/services/auth/hooks/useHandleSession';
import { ErrorBoundary } from '@sentry/react-native';
import ErrorScreen from '@/screens/ErrorScreen';

Sentry.init({
  dsn: Env.SENTRY_DSN,
  debug: false,
  enabled: !__DEV__,
});

const App = () => {
  initPurchases();

  useHandleSession();

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer theme={darkNavigationTheme}>
          <ErrorBoundary
            fallback={({ error, resetError }) => (
              <ErrorScreen error={error} resetError={resetError} />
            )}
            showDialog={true}
          >
            <UpdateProvider>
              <FloatingInputProvider>
                <RootNavigator />
              </FloatingInputProvider>
            </UpdateProvider>
            <Toast config={toastConfig} />
          </ErrorBoundary>
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
