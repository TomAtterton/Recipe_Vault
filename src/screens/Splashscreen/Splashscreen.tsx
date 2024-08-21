import { ActivityIndicator, View } from 'react-native';

import useHydration from '@/store/useHydration';
import React, { useEffect, useCallback } from 'react';

import * as ExpoSplashscreen from 'expo-splash-screen';
import { useNavigation } from '@react-navigation/native';
import { useBoundStore } from '@/store';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './splashscreen.style';
import { onOpenDatabase } from '@/database';
import { Image } from 'expo-image';
import { showErrorMessage } from '@/utils/promptUtils';
import Typography from '@/components/Typography';
import expoConstants from 'expo-constants';
import images from '@/theme/images';
import { Routes } from '@/navigation/Routes';

const Splashscreen = () => {
  const hasHydrated = useHydration();

  const isAuthenticated = useBoundStore((state) => !!state.session?.access_token);

  const hasOnboarded = useBoundStore((state) => state.hasOnboarded);

  const { reset } = useNavigation();

  const hideSplash = useCallback(async () => {
    await ExpoSplashscreen.hideAsync();
  }, []);

  const currentDatabaseName = useBoundStore((state) => state.currentDatabaseName);
  useEffect(() => {
    const onSetup = async () => {
      if (hasHydrated && currentDatabaseName) {
        try {
          await onOpenDatabase({ currentDatabaseName });
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
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={images.SPLASHSCREEN} contentFit={'cover'} />
      <View style={styles.bottomContent}>
        <ActivityIndicator
          style={styles.activityIndicator}
          size={'small'}
          color={theme.colors.primary}
        />
        <Typography
          variant={'titleSmall'}
        >{`version ${expoConstants.expoConfig?.version}`}</Typography>
      </View>
    </View>
  );
};

export default Splashscreen;
