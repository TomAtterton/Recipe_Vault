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

const Help = () => {
  const { navigate } = useNavigation();
  const { styles } = useStyles(stylesheet);

  const handleContactUs = () =>
    handleMail({
      headerText: `
      Hi,
      
      I'm reaching out for help with Recipe Vault. Here's my issue:
      
      [Please describe your issue here]
    `,
    });

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Typography variant={'titleItalicLarge'}>Help.</Typography>
        <SettingsButton
          title={'Privacy'}
          onPress={() => navigate(Routes.Privacy)}
          iconSource={'hand'}
        />
        <SettingsButton
          title={'Terms and Conditions'}
          onPress={() =>
            openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')
          }
          iconSource={'info-border'}
        />
        <SettingsButton
          title={'Contact Us'}
          onPress={handleContactUs} // Updated to call the new handler
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
