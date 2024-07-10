import * as React from 'react';
import { View } from 'react-native';

import NavBarButton from '@/components/buttons/NavBarButton';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from '@/screens/Settings/settings.style';
import SettingsButton from '@/components/buttons/SettingsButton';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import Typography from '@/components/Typography';
import { openURL } from 'expo-linking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { requestReview } from 'expo-store-review';
import SupportApp from '@/screens/SupportApp';
import BottomSheet from '@/components/BottomSheet';
import { useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const Settings = () => {
  const { styles } = useStyles(stylesheet);

  const { navigate, goBack } = useNavigation();
  const { top } = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleSupportApp = () => {
    bottomSheetRef.current?.present();
  };

  return (
    <View
      style={[
        styles.container,
        {
          marginTop: top,
        },
      ]}
    >
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />
      <View style={styles.contentContainer}>
        <Typography variant={'titleItalicLarge'}>Settings.</Typography>
        <SettingsButton
          title={'General'}
          onPress={() => navigate(Routes.AppSettings)}
          iconSource={'settings'}
        />
        <SettingsButton
          title={'Database'}
          onPress={() => navigate(Routes.DatabaseSettings)}
          iconSource={'safe'}
        />
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
        <SettingsButton title={'Help'} onPress={() => navigate(Routes.Help)} iconSource={'more'} />
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: 40,
            gap: 20,
          }}
        >
          <SettingsButton
            title={'Support App'}
            onPress={handleSupportApp}
            iconSource={'ufo-flying'}
          />
          <SettingsButton title={'Review App'} onPress={requestReview} iconSource={'appstore'} />
          <BottomSheet
            bottomSheetRef={bottomSheetRef}
            snapPoints={['50%']}
            title={'Help support the app!'}
          >
            <SupportApp />
          </BottomSheet>
        </View>
      </View>
    </View>
  );
};

export default Settings;
