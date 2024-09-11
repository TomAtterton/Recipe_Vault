import { SafeAreaView, View } from 'react-native';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import SettingsButton from '@/components/buttons/SettingsButton';
import * as React from 'react';
import { useBoundStore } from '@/store';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import { translate } from '@/core';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { stylesheet } from './syncSettings.style';
import OutlineButton from '@/components/buttons/OutlineButton';
import { Routes } from '@/navigation/Routes';
import { onSignOut } from '@/services/auth';
import useIsLoggedIn from '@/hooks/common/useIsLoggedIn';

const SyncSettings = () => {
  const { styles } = useStyles(stylesheet);
  const syncEnabled = useBoundStore((state) => state.shouldSync);
  const { goBack, navigate, reset } = useNavigation();
  const groupName = useBoundStore((state) => state.profile.groupName);

  const databaseStatus = useBoundStore((state) => state.databaseStatus);

  const [isLoading, setIsLoading] = React.useState(false);

  const isLoggedIn = useIsLoggedIn();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await onSignOut();
    } finally {
      setIsLoading(false);
    }
  };

  const handleProNavigation = () => {
    navigate(Routes.ProPlan);
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />
      <View style={styles.container}>
        <Typography variant={'titleItalicLarge'}>{translate('sync_settings.title')}</Typography>
        {syncEnabled && (
          <>
            <InfoLabelButton
              title={translate('sync_settings.current_vault')}
              buttonTitle={groupName}
            />
            <InfoLabelButton
              title={translate('sync_settings.vault_status')}
              buttonTitle={databaseStatus}
            />
          </>
        )}

        {syncEnabled ? (
          <>
            {databaseStatus === 'free' && (
              <SettingsButton
                title={translate('sync_settings.upgrade_to_pro')}
                onPress={handleProNavigation}
                iconSource={'ufo-flying'}
              />
            )}
            <SettingsButton
              title={translate('sync_settings.advanced_sync_settings')}
              iconSource={'cog'}
              onPress={() => navigate(Routes.AdvanceSyncSettings)}
            />

            {/*<SettingsButton*/}
            {/*  title={'Manage Group Users'}*/}
            {/*  iconSource={'people'}*/}
            {/*  onPress={() => navigate(Routes.ManageGroupUsers)}*/}
            {/*/>*/}
          </>
        ) : (
          <SettingsButton
            style={styles.enableSyncButton}
            title={
              isLoggedIn
                ? translate('sync_settings.enable_cloud_vault')
                : translate('sync_settings.enable_sync')
            }
            onPress={() => {
              if (!isLoggedIn) {
                navigate(Routes.Login, {
                  showSkip: false,
                });
              } else {
                reset({
                  index: 0,
                  routes: [
                    { name: Routes.TabStack },
                    { name: Routes.Settings },
                    { name: Routes.DatabaseSettings },
                  ],
                });
              }
            }}
            iconSource={'cloud'}
          />
        )}
        {isLoggedIn && (
          <SettingsButton
            title={translate('sync_settings.account_settings')}
            iconSource={'info'}
            onPress={() => navigate(Routes.AccountSettings)}
          />
        )}
        {isLoggedIn && (
          <View style={styles.bottomContent}>
            <OutlineButton
              contentStyle={styles.logoutButton}
              title={translate('settings.logout')}
              onPress={handleSignOut}
              isLoading={isLoading}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SyncSettings;
