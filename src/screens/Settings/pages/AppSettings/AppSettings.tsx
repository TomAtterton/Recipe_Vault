import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import expoConstants from 'expo-constants';
import { Routes } from '@/navigation/Routes';
import SettingsButton from '@/components/buttons/SettingsButton';
import { translate } from '@/core';
import SettingsContainer from '@/components/SettingsContainer';

const AppSettings = () => {
  const navigation = useNavigation();
  const handleShowOnboarding = () => navigation.navigate(Routes.Onboarding);
  const handleShowCredits = () => navigation.navigate(Routes.Credits);
  return (
    <SettingsContainer title={translate('app_settings.title')}>
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
    </SettingsContainer>
  );
};

export default AppSettings;
