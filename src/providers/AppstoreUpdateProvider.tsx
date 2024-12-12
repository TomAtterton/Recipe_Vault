import React, { useEffect, useState } from 'react';
import { Linking, Platform, View } from 'react-native';
import { useBoundStore } from '@/store'; // Adjust the import based on your store location
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import * as Application from 'expo-application';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Typography from '../components/Typography';
import { translate } from '@/core';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import LabelButton from '@/components/buttons/LabelButton';

const APPLE_APP_ID = '6476562251'; // Replace with your app's Apple ID
const ANDROID_PACKAGE_NAME = Application.applicationId; // Your app's package name

interface UpdateProviderProps {
  children: React.ReactNode;
}

const UpdateProvider: React.FC<UpdateProviderProps> = ({ children }) => {
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [latestVersion, setLatestVersion] = useState<string>('');

  const dismissedUpdateVersion = useBoundStore((state) => state.dismissedUpdateVersion);
  const setDismissedUpdateVersion = useBoundStore((state) => state.setDismissedUpdateVersion);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkForUpdate();
    }, 2000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dismissedUpdateVersion]);

  const checkForUpdate = async () => {
    try {
      let version: string | null = null;
      const currentVersion = Application.nativeApplicationVersion;
      if (Platform.OS === 'ios') {
        // Fetch latest version from App Store
        const response = await fetch(
          `https://itunes.apple.com/lookup?id=${APPLE_APP_ID}&country=us`,
        );
        const json = await response.json();

        if (json.results.length > 0) {
          version = json.results[0].version;
        }
      } else if (Platform.OS === 'android') {
        // Fetch latest version from Play Store
        const response = await fetch(
          `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}&hl=en&gl=us`,
        );
        const html = await response.text();

        // Try to extract the version number from the HTML
        const versionMatch = html.match(/"softwareVersion":"([\d.]+)"/);

        if (versionMatch && versionMatch.length > 1) {
          version = versionMatch[1];
        }
      }

      if (version && currentVersion && version !== currentVersion) {
        if (dismissedUpdateVersion !== version) {
          setUpdateAvailable(true);
          setLatestVersion(version);
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  const handleDismiss = () => {
    setDismissedUpdateVersion(latestVersion);
    setUpdateAvailable(false);
  };

  const handleUpdate = () => {
    let url = '';
    if (Platform.OS === 'ios') {
      url = `https://apps.apple.com/app/id${APPLE_APP_ID}`;
    } else if (Platform.OS === 'android') {
      url = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`;
    }
    setDismissedUpdateVersion(latestVersion);
    setUpdateAvailable(false);
    Linking.openURL(url);
  };

  const { styles } = useStyles(stylesheet);
  return (
    <>
      {children}
      {updateAvailable && (
        <Animated.View
          entering={SlideInDown.duration(500)}
          exiting={SlideOutDown.duration(500)}
          style={styles.updateContainer}
        >
          <View style={styles.updateDialog}>
            <Typography variant={'titleLarge'} style={styles.updateText}>
              {translate('update.title')}
            </Typography>
            <Typography variant={'bodySmallItalic'} style={styles.description}>
              {translate('update.message')}
            </Typography>
            <PrimaryButton title={translate('update.update_button')} onPress={handleUpdate} />
            <LabelButton title={translate('update.skip_button')} onPress={handleDismiss} />
          </View>
        </Animated.View>
      )}
    </>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  updateContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background40,
  },
  updateDialog: {
    backgroundColor: theme.colors.lightBackground,
    paddingVertical: 20,
    paddingHorizontal: 40,
    gap: 10,
    elevation: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 10,
  },
  updateText: {
    marginBottom: 10,
  },
}));

export default UpdateProvider;
