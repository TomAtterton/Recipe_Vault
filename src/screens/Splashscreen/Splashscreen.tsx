import { ActivityIndicator, View } from 'react-native';

import useHydration from '@/store/useHydration';
import React, { useEffect } from 'react';

import * as ExpoSplashscreen from 'expo-splash-screen';
import { useNavigation } from '@react-navigation/native';
import { useBoundStore } from '@/store';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './splashscreen.style';
import Typography from '@/components/Typography';
import { openDatabase } from '@/database';
import { Routes } from '@/navigation/Routes';
import { ImageBackground } from 'expo-image';
import { showErrorMessage } from '@/utils/errorUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Splashscreen = () => {
  const hasHydrated = useHydration();

  const isAuthenticated = useBoundStore((state) => !!state.session?.access_token);

  const hasOnboarded = useBoundStore((state) => state.hasOnboarded);

  const { reset } = useNavigation();

  const hideSplash = React.useCallback(async () => {
    await ExpoSplashscreen.hideAsync();
  }, []);

  const currentDatabaseName = useBoundStore((state) => state.currentDatabaseName);
  useEffect(() => {
    const onSetup = async () => {
      if (hasHydrated && currentDatabaseName) {
        try {
          await openDatabase({ currentDatabaseName });
          await hideSplash();
        } catch (error) {
          // @ts-ignore
          showErrorMessage(error?.message);
        } finally {
          setTimeout(() => {
            reset({
              index: 0,
              routes: [{ name: hasOnboarded ? Routes.TabStack : Routes.Onboarding }],
            });
          }, 500);
        }
      }
    };
    onSetup();
  }, [hideSplash, hasHydrated, reset, isAuthenticated, hasOnboarded, currentDatabaseName]);

  const { styles, theme } = useStyles(stylesheet);
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imageBackground}
        source={require('../../../assets/splash.png')}
        contentFit={'cover'}
      >
        <View
          style={[
            styles.bottomContent,
            {
              paddingBottom: bottom,
            },
          ]}
        >
          <Typography style={styles.title} variant={'displayMedium'}>
            Recipe Vault
          </Typography>
          <ActivityIndicator
            style={styles.activityIndicator}
            size={'large'}
            color={theme.colors.primary}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default Splashscreen;
