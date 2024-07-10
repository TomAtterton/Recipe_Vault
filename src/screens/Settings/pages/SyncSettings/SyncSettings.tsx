import { Share, SafeAreaView, View, Alert } from 'react-native';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import SettingsButton from '@/components/buttons/SettingsButton';
import { syncPush } from '@/database/supabase/syncPush';
import { syncPull } from '@/database/supabase/syncPull';
import * as React from 'react';
import { setLastSynced, setResetDatabase, setResetProfile, useBoundStore } from '@/store';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import { translate } from '@/core';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { stylesheet } from './syncSettings.style';
import OutlineButton from '@/components/buttons/OutlineButton';
import { onSignOut } from '@/database/api/auth';
import { showMessage } from 'react-native-flash-message';
import { Routes } from '@/navigation/Routes';
import { openDatabase } from '@/database';
import { Env } from '@/core/env';
import { supabase } from '@/database/supabase';

const SyncSettings = () => {
  const { styles } = useStyles(stylesheet);
  const lastSynced = useBoundStore((state) => state.lastSynced);
  const syncEnabled = useBoundStore((state) => state.shouldSync);
  const { goBack, navigate } = useNavigation();
  const profile = useBoundStore((state) => state.profile);

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await onSignOut();

      setResetProfile();
      setResetDatabase();
      await openDatabase({ currentDatabaseName: Env.SQLITE_DB_NAME });
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
            profile?.id && (await supabase.auth.admin.deleteUser(profile?.id));
            await onSignOut();
            setResetProfile();
            setResetDatabase();
            await openDatabase({ currentDatabaseName: Env.SQLITE_DB_NAME });
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
            <InfoLabelButton title={translate('settings.user_id')} buttonTitle={profile?.id} />
            <InfoLabelButton
              title={translate('settings.database.last_synced')}
              buttonTitle={lastSynced || 'has not synced'}
            />
          </>
        )}
        {!syncEnabled && (
          <SettingsButton
            style={{
              marginTop: 20,
            }}
            title={'Enable Sync'}
            onPress={() => navigate(Routes.Login)}
            iconSource={'cloud'}
          />
        )}
        {syncEnabled && (
          <>
            <SettingsButton
              title={'Share Database'}
              onPress={handleShareDatabase}
              iconSource={'cloud'}
            />
            <SettingsButton title={'Sync Push'} onPress={syncPush} iconSource={'cloud'} />
            <SettingsButton
              title={'Sync Pull'}
              onPress={() => syncPull(true)}
              iconSource={'cloud'}
            />
            <SettingsButton
              title={'Reset last synced'}
              onPress={() => setLastSynced(undefined)}
              iconSource={'cloud'}
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
        )}
      </View>
    </SafeAreaView>
  );
};

export default SyncSettings;
