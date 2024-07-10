import { Alert, SafeAreaView, View } from 'react-native';
import Typography from '@/components/Typography';
import { UnistylesRuntime, useStyles } from 'react-native-unistyles';
import * as React from 'react';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { stylesheet } from './appSettings.style';
import { setBetaMode, setDarkMode, useBoundStore } from '@/store';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import expoConstants from 'expo-constants';
import { Routes } from '@/navigation/Routes';
import SettingsButton from '@/components/buttons/SettingsButton';
import { Env } from '@/core/env';

const AppSettings = () => {
  const { styles } = useStyles(stylesheet);
  const { goBack } = useNavigation();

  const darkMode = useBoundStore((state) => state.darkMode);

  const handleSwitchTheme = () => {
    UnistylesRuntime.setTheme(darkMode ? 'light' : 'dark');
    setDarkMode(!darkMode);
  };

  const navigation = useNavigation();
  const handleShowOnboarding = () => navigation.navigate(Routes.Onboarding);

  const isBetaModeEnabled = useBoundStore((state) => state.isBetaMode);

  const handleToggleBetaMode = () => {
    if (isBetaModeEnabled) {
      return Alert.alert('Beta Mode', 'Are you sure you want to disable beta mode?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            setBetaMode(!isBetaModeEnabled);
          },
        },
      ]);
    }
    const secretBetaCode = Env.BETA_KEY;

    Alert.prompt('Beta Mode', 'Enter the secret code to enable beta mode', (text) => {
      if (text === secretBetaCode) {
        setBetaMode(!isBetaModeEnabled);
      } else {
        Alert.alert('Beta Mode', 'Invalid code');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />

      <View style={styles.container}>
        <Typography variant={'titleItalicLarge'}>App Settings.</Typography>
        <InfoLabelButton
          title={'App Version'}
          buttonTitle={`${expoConstants.expoConfig?.version}`}
        />
        <InfoLabelButton
          buttonTitle={isBetaModeEnabled ? 'Enabled' : 'Disabled'}
          title={'Beta Mode'}
          onPress={handleToggleBetaMode}
        />

        {isBetaModeEnabled && (
          <InfoLabelButton
            title={'Current Theme'}
            buttonTitle={darkMode ? 'Dark Mode' : 'Light Mode'}
            onPress={handleSwitchTheme}
          />
        )}
        <SettingsButton
          title={'Show Onboarding'}
          onPress={handleShowOnboarding}
          iconSource={'hand'}
        />
      </View>
    </SafeAreaView>
  );
};

export default AppSettings;
