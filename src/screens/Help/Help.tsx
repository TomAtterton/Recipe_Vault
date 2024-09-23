import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import SettingsButton from '@/components/buttons/SettingsButton';
import { openURL } from 'expo-linking';
import { Routes } from '@/navigation/Routes';
import { handleMail } from '@/utils/mailUtils';
import { translate } from '@/core';
import SettingsContainer from '@/components/SettingsContainer';

const Help = () => {
  const { navigate } = useNavigation();

  const handleContactUs = () =>
    handleMail({
      headerText: translate('help.mail_template'),
    });

  return (
    <SettingsContainer title={translate('help.title')}>
      <SettingsButton
        title={translate('help.privacy')}
        onPress={() => navigate(Routes.Privacy)}
        iconSource={'hand'}
      />
      <SettingsButton
        title={translate('help.terms_conditions')}
        onPress={() => openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}
        iconSource={'info-border'}
      />
      <SettingsButton
        title={translate('help.contact_us')}
        onPress={handleContactUs}
        iconSource={'paper-plane'}
      />
    </SettingsContainer>
  );
};

export default Help;
