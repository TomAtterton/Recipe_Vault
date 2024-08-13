import * as React from 'react';
import { View } from 'react-native';

import NavBarButton from '@/components/buttons/NavBarButton';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from '@/screens/Settings/settings.style';
import SettingsButton from '@/components/buttons/SettingsButton';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import Typography from '@/components/Typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { requestReview } from 'expo-store-review';
import SupportApp from '@/screens/SupportApp';
import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';
import { useRef } from 'react';

const Settings = () => {
  const { styles } = useStyles(stylesheet);

  const { navigate, goBack } = useNavigation();
  const { top } = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const handleSupportApp = () => {
    bottomSheetRef.current?.present();
  };
  const handleSyncDatabase = async () => {
    navigate(Routes.SyncSettings);
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
          title={'Recipes'}
          onPress={() => navigate(Routes.RecipeSettings)}
          iconSource={'hamburger'}
        />
        <SettingsButton
          title={'Vaults'}
          onPress={() => navigate(Routes.DatabaseSettings)}
          iconSource={'safe'}
        />
        <SettingsButton title={'Cloud Sync'} onPress={handleSyncDatabase} iconSource={'cloud'} />

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
          <BottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['50%']}>
            <SupportApp />
          </BottomSheet>
        </View>
      </View>
    </View>
  );
};

export default Settings;
