import 'react-native-gesture-handler';

import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { RootNavigator } from '@/navigation';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
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

Sentry.init({
  dsn: Env.SENTRY_DSN,
  debug: false,
});

const App = () => {
  initPurchases();
  const isDarkMode = useBoundStore((state) => state.darkMode);
  useInitialTheme(isDarkMode ? 'dark' : 'light');

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <NavigationContainer theme={isDarkMode ? darkNavigationTheme : lightNavigationTheme}>
            <FloatingInputProvider>
              <UpdateProvider>
                <RootNavigator />
              </UpdateProvider>
            </FloatingInputProvider>
          </NavigationContainer>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
      <FlashMessage position="top" />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Sentry.wrap(App);
