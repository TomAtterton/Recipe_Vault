import { SafeAreaView, View } from 'react-native';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import * as React from 'react';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { stylesheet } from './appSettings.style';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import expoConstants from 'expo-constants';
import { Routes } from '@/navigation/Routes';
import SettingsButton from '@/components/buttons/SettingsButton';
import { translate } from '@/core';

const AppSettings = () => {
  const { styles } = useStyles(stylesheet);
  const { goBack } = useNavigation();

  const navigation = useNavigation();
  const handleShowOnboarding = () => navigation.navigate(Routes.Onboarding);
  const handleShowCredits = () => navigation.navigate(Routes.Credits);
  return (
    <SafeAreaView style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />

      <View style={styles.container}>
        <Typography variant={'titleItalicLarge'}>{translate('app_settings.title')}</Typography>
        <InfoLabelButton
          title={translate('app_settings.app_version')}
          buttonTitle={`${expoConstants.expoConfig?.version}`}
        />
        <SettingsButton
          title={translate('app_settings.show_onboarding')}
          onPress={handleShowOnboarding}
          iconSource={'hand'}
        />
        <SettingsButton
          title={translate('app_settings.credits')}
          onPress={handleShowCredits}
          iconSource={'info-border'}
        />
      </View>
    </SafeAreaView>
  );
};

export default AppSettings;
