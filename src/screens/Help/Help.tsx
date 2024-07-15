import { View } from 'react-native';
import Typography from '@/components/Typography';
import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from '@/screens/Settings/settings.style';
import SettingsButton from '@/components/buttons/SettingsButton';
import { openURL } from 'expo-linking';
import { Routes } from '@/navigation/Routes';

const Help = () => {
  const { top } = useSafeAreaInsets();
  const { navigate, goBack } = useNavigation();
  const { styles } = useStyles(stylesheet);

  return (
    <View
      style={{
        flex: 1,
        marginTop: top,
      }}
    >
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: top + 32,
          gap: 20,
        }}
      >
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
          onPress={() => openURL('mailto:tpatterton@gmail.com')}
          iconSource={'paper-plane'}
        />
      </View>
    </View>
  );
};

export default Help;
