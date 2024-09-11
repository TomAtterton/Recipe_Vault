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
import { translate } from '@/core';

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
        <Typography variant={'titleItalicLarge'}>{translate('app_settings.title')}</Typography>
        <SettingsButton
          title={translate('general_settings.general')}
          onPress={() => navigate(Routes.AppSettings)}
          iconSource={'settings'}
        />
        <SettingsButton
          title={translate('general_settings.recipes')}
          onPress={() => navigate(Routes.RecipeSettings)}
          iconSource={'hamburger'}
        />
        <SettingsButton
          title={translate('general_settings.vaults')}
          onPress={() => navigate(Routes.DatabaseSettings)}
          iconSource={'safe'}
        />
        <SettingsButton
          title={translate('general_settings.cloud_sync')}
          onPress={handleSyncDatabase}
          iconSource={'cloud'}
        />

        <SettingsButton
          title={translate('general_settings.help')}
          onPress={() => navigate(Routes.Help)}
          iconSource={'more'}
        />
        <View style={styles.bottomContainer}>
          <SettingsButton
            title={translate('general_settings.support_app')}
            onPress={handleSupportApp}
            iconSource={'ufo-flying'}
          />
          <SettingsButton
            title={translate('general_settings.review_app')}
            onPress={requestReview}
            iconSource={'appstore'}
          />
          <BottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['50%']}>
            <SupportApp />
          </BottomSheet>
        </View>
      </View>
    </View>
  );
};

export default Settings;
