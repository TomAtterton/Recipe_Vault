import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

import NavBarButton from '@/components/buttons/NavBarButton';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import SettingsButton from '@/components/buttons/SettingsButton';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { requestReview } from 'expo-store-review';
import SupportApp from '@/screens/SupportApp';
import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';
import { useRef, useState } from 'react';
import { translate } from '@/core';
import useHasPremium from '@/services/pro/useHasPremium';
import Avatar from '@/components/Avatar';
import LabelButton from '@/components/buttons/LabelButton';
import useIsLoggedIn from '@/hooks/common/useIsLoggedIn';
import { onSignOut } from '@/services/auth';

const Settings = () => {
  const { styles } = useStyles(stylesheet);

  const { navigate, goBack, reset } = useNavigation();
  const { top } = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const handleSupportApp = () => {
    bottomSheetRef.current?.present();
  };

  const hasPremium = useHasPremium();
  const isLoggedIn = useIsLoggedIn();

  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await onSignOut();
      reset({
        index: 0,
        routes: [{ name: Routes.TabStack }],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
          <Avatar />
          {!hasPremium && (
            <SettingsButton
              style={styles.upgradeButton}
              title={translate('general_settings.upgrade_account')}
              onPress={() => navigate(Routes.ProPlan)}
              iconSource={'celebrate'}
            />
          )}
          <SettingsButton
            title={translate('general_settings.general')}
            onPress={() => navigate(Routes.AppSettings)}
            iconSource={'settings'}
          />
          <SettingsButton
            title={translate('general_settings.vaults')}
            onPress={() => navigate(Routes.DatabaseSettings)}
            iconSource={'safe'}
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
            {isLoggedIn && <LabelButton title={'logout'} onPress={handleSignOut} />}
            <BottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['50%']}>
              <SupportApp />
            </BottomSheet>
          </View>
        </View>
      </View>
      {isLoading && <ActivityIndicator style={styles.activityIndicator} />}
    </>
  );
};

const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentContainer: {
    flex: 1,
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    gap: 20,
  },
  upgradeButton: {
    marginBottom: 40,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40,
    gap: 20,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));

export default Settings;
