import { Alert, SafeAreaView, View } from 'react-native';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import SettingsButton from '@/components/buttons/SettingsButton';
import { dropTables } from '@/database/sql/initDatabase';
import { database, openDatabase } from '@/database';
import * as React from 'react';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { stylesheet } from '@/screens/Settings/pages/DatabaseSettings/databaseSettings.style';
import { deleteDatabaseAsync } from 'expo-sqlite/next';
import { showSuccessMessage } from '@/utils/promptUtils';
import { showErrorMessage } from '@/utils/errorUtils';
import { Routes } from '@/navigation/Routes';
import { useMemo } from 'react';
import { setCurrentDatabaseName, setResetDatabase, updateProfile, useBoundStore } from '@/store';
import { Env } from '@/core/env';
import { showMessage } from 'react-native-flash-message';
import LabelButton from '@/components/buttons/LabelButton';
import { getProfileGroup } from '@/database/supabase/getProfileGroup';
import { syncWithSupabase } from '@/database/supabase/syncUtils';

const DatabaseSettings = () => {
  const { styles } = useStyles(stylesheet);
  const { goBack } = useNavigation();

  const handleResetDatabase = async () => {
    try {
      Alert.alert('Reset Database', 'Are you sure you want to reset the database?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            if (database?.databaseName) {
              await database.closeAsync();
              await deleteDatabaseAsync(database?.databaseName);
              await openDatabase({
                currentDatabaseName: database.databaseName,
                shouldClose: false,
              });
              showSuccessMessage('Database reset successfully');
            }
          },
        },
      ]);
    } catch (error) {
      console.log('error', error);
      showErrorMessage('Error resetting database');
    }
  };

  const handleClearDatabase = async () => {
    try {
      Alert.alert('Clear Database', 'Are you sure you want to clear the database?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await dropTables(database);
            showSuccessMessage('Database cleared successfully');
          },
        },
      ]);
    } catch (error) {
      console.log('error', error);
      showErrorMessage('Error clearing database');
    }
  };

  const databaseUserVersion = useMemo(
    // @ts-ignore
    () => database?.getFirstSync('PRAGMA user_version')?.user_version,
    []
  );

  const { navigate } = useNavigation();
  const handleNavigateToDatabaseDetails = () => {
    navigate(Routes.DatabaseEditor);
  };

  const showTestSettings = !__DEV__;
  const isSyncEnabled = useBoundStore((state) => state.shouldSync);
  const setSyncEnabled = useBoundStore((state) => state.setShouldSync);
  const groupName = useBoundStore((state) => state.profile?.groupName);
  const userId = useBoundStore((state) => state.profile?.id);

  const handleSwitchDatabase = () => {
    Alert.alert(
      isSyncEnabled ? 'Switch to local vault?' : 'Switch to cloud vault?',
      isSyncEnabled
        ? 'Will disable cloud sync and switch to local vault.'
        : 'Will enable cloud sync and switch to cloud vault.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            if (isSyncEnabled) {
              try {
                // setResetProfile();
                updateProfile({
                  groupId: Env.TEST_GROUP_ID,
                  groupName: 'Local Vault',
                });
                setResetDatabase();
                setSyncEnabled(false);
                await openDatabase({ currentDatabaseName: Env.SQLITE_DB_NAME });
              } catch (error) {
                showMessage({
                  message: 'Error',
                  description: 'Something went wrong',
                  type: 'danger',
                  duration: 3000,
                  icon: 'danger',
                });
              }
            } else {
              const { groupId, groupName } = await getProfileGroup({
                userId,
              });
              if (groupId && groupName) {
                updateProfile({
                  groupId,
                  groupName,
                });
                setSyncEnabled(true);
                const currentDatabaseName = `${groupName}.db`;
                setCurrentDatabaseName(currentDatabaseName);
                await openDatabase({ currentDatabaseName });
                await syncWithSupabase();
              } else {
                navigate(Routes.Login, {
                  showSkip: true,
                });
              }
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />

      <View style={styles.container}>
        <Typography variant={'titleLarge'}>Vault Settings.</Typography>
        <InfoLabelButton
          title={isSyncEnabled ? 'Cloud Vault:' : 'Local Vault:'}
          buttonTitle={groupName || 'Local Vault'}
          iconSource={isSyncEnabled ? 'cloud' : 'vault'}
        />
        <LabelButton
          title={isSyncEnabled ? 'Switch to local vault' : 'Switch to cloud vault'}
          onPress={handleSwitchDatabase}
        />
        {showTestSettings && (
          <InfoLabelButton title={'Version'} buttonTitle={databaseUserVersion} />
        )}

        {showTestSettings && (
          <SettingsButton
            title={'Open Database Details'}
            onPress={handleNavigateToDatabaseDetails}
            iconSource={'settings'}
          />
        )}
        <View style={styles.dangerZoneContainer}>
          <Typography variant={'titleLarge'} style={styles.dangerZoneTitle}>
            Danger Zone:
          </Typography>
          <Typography variant={'bodyMedium'}>
            Having trouble with the app? Try these options:
          </Typography>
          <SettingsButton
            title={'Clear All Recipes'}
            onPress={handleClearDatabase}
            iconSource={'bin'}
          />
          <SettingsButton
            title={'Delete and Reset Vault'}
            onPress={handleResetDatabase}
            iconSource={'bin'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DatabaseSettings;
