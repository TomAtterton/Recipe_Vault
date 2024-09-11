import { View } from 'react-native';
import Typography from '@/components/Typography';
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import SettingsButton from '@/components/buttons/SettingsButton';
import { openURL } from 'expo-linking';
import { Routes } from '@/navigation/Routes';
import BackButton from '@/components/BackButton';
import { handleMail } from '@/utils/mailUtils';
import { translate } from '@/core';

const Help = () => {
  const { navigate } = useNavigation();
  const { styles } = useStyles(stylesheet);

  const handleContactUs = () =>
    handleMail({
      headerText: translate('help.mail_template'),
    });

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Typography variant={'titleItalicLarge'}>{translate('help.title')}</Typography>
        <SettingsButton
          title={translate('help.privacy')}
          onPress={() => navigate(Routes.Privacy)}
          iconSource={'hand'}
        />
        <SettingsButton
          title={translate('help.terms_conditions')}
          onPress={() =>
            openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')
          }
          iconSource={'info-border'}
        />
        <SettingsButton
          title={translate('help.contact_us')}
          onPress={handleContactUs}
          iconSource={'paper-plane'}
        />
      </View>
      <BackButton />
    </View>
  );
};

const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    paddingTop: miniRuntime.insets.top + 60,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 20,
  },
}));

export default Help;
