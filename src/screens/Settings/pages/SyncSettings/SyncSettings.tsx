import { Share, SafeAreaView, View, Alert } from 'react-native';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import SettingsButton from '@/components/buttons/SettingsButton';
import * as React from 'react';
import { setResetDatabase, setResetProfile, useBoundStore } from '@/store';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import { translate } from '@/core';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { stylesheet } from './syncSettings.style';
import OutlineButton from '@/components/buttons/OutlineButton';
import { onSignOut } from '@/database/api/auth';
import { showMessage } from 'react-native-flash-message';
import { Routes } from '@/navigation/Routes';
import { database, openDatabase } from '@/database';
import { Env } from '@/core/env';
import { supabase } from '@/database/supabase';

const SyncSettings = () => {
  const { styles } = useStyles(stylesheet);
  const syncEnabled = useBoundStore((state) => state.shouldSync);
  const { goBack, navigate } = useNavigation();
  const profile = useBoundStore((state) => state.profile);
  const setSyncEnabled = useBoundStore((state) => state.setShouldSync);

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await onSignOut();
      setResetProfile();
      setResetDatabase();
      await openDatabase({ currentDatabaseName: Env.SQLITE_DB_NAME });
      setSyncEnabled(false);
    } catch (error) {
      showMessage({
        message: 'Error',
        description: 'Something went wrong',
        type: 'danger',
        duration: 3000,
        icon: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert('Delete Account', 'Are you sure you want to delete your account?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            setIsLoading(true);

            const { error } = await supabase.functions.invoke('delete-user');

            if (error) {
              throw new Error('Contact customer support there was an issue deleting you account');
            }

            database?.closeSync();
            await onSignOut();
            setResetProfile();
            setResetDatabase();

            await openDatabase({
              shouldClose: false,
              currentDatabaseName: Env.SQLITE_DB_NAME,
            });
          } catch (error) {
            showMessage({
              message: 'Error',
              // @ts-ignore
              description: error?.message || 'Something went wrong',
              type: 'danger',
              duration: 3000,
              icon: 'danger',
            });
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const handleShareDatabase = async () => {
    await Share.share({
      title: 'Share database code with a friend',
      message: profile?.groupId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />
      <View style={styles.container}>
        <Typography variant={'titleItalicLarge'}>Sync Settings.</Typography>
        {syncEnabled && (
          <>
            <InfoLabelButton title={'Current Vault.'} buttonTitle={profile?.groupName} />
            <InfoLabelButton
              title={translate('settings.group_id')}
              buttonTitle={profile?.groupId}
            />
          </>
        )}

        {syncEnabled ? (
          <>
            <SettingsButton
              title={'Share Database Code'}
              onPress={handleShareDatabase}
              iconSource={'paper-plane'}
            />
            <SettingsButton
              title={'Advanced Sync Settings'}
              iconSource={'cog'}
              onPress={() => navigate(Routes.AdvanceSyncSettings)}
            />

            <View style={styles.bottomContainer}>
              <OutlineButton
                title={'Delete Account'}
                onPress={handleDeleteAccount}
                isLoading={isLoading}
              />
              <OutlineButton
                title={translate('settings.logout')}
                onPress={handleSignOut}
                isLoading={isLoading}
              />
            </View>
          </>
        ) : (
          <SettingsButton
            style={styles.enableSyncButton}
            title={'Enable Sync'}
            onPress={() => navigate(Routes.Login)}
            iconSource={'cloud'}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SyncSettings;
