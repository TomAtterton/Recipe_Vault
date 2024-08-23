import { View } from 'react-native';
import Typography from '@/components/Typography';
import * as React from 'react';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import SettingsButton from '@/components/buttons/SettingsButton';
import { openURL } from 'expo-linking';
import { Routes } from '@/navigation/Routes';

const Help = () => {
  const { navigate, goBack } = useNavigation();
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />
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
          onPress={() => openURL('mailto:hello@tomatterton.com')}
          iconSource={'paper-plane'}
        />
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    marginTop: miniRuntime.insets.top,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: miniRuntime.insets.top + 32,
    gap: 20,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));

export default Help;
