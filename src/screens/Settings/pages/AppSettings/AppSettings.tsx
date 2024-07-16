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

const AppSettings = () => {
  const { styles } = useStyles(stylesheet);
  const { goBack } = useNavigation();

  const navigation = useNavigation();
  const handleShowOnboarding = () => navigation.navigate(Routes.Onboarding);

  return (
    <SafeAreaView style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />

      <View style={styles.container}>
        <Typography variant={'titleItalicLarge'}>App Settings.</Typography>
        <InfoLabelButton
          title={'App Version'}
          buttonTitle={`${expoConstants.expoConfig?.version}`}
        />
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
