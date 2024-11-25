import { Alert, View } from 'react-native';
import { translate } from '@/core';
import { database, onDeleteDatabase, onOpenDatabase } from '@/database';
import { showErrorMessage, showSuccessMessage } from '@/utils/promptUtils';
import { deleteDatabaseAsync } from 'expo-sqlite';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from '@/screens/Settings/pages/DatabaseSettings/databaseSettings.style';
import Typography from '@/components/Typography';
import SettingsButton from '@/components/buttons/SettingsButton';
import * as React from 'react';
import { onDeleteGroup } from '@/services/group';
import { setResetDatabase, updateProfile, useBoundStore } from '@/store';
import { Env } from '@/core/env';
import SettingsContainer from '@/components/SettingsContainer';

const AdvanceDatabaseSettings = () => {
  const currentGroupId = useBoundStore((state) => state.profile.groupId);
  const currentDatabaseName = useBoundStore((state) => state.currentDatabaseName);

  const handleResetDatabase = async () => {
    try {
      Alert.alert(
        translate('prompt.reset_database.title'),
        translate('prompt.reset_database.message'),
        [
          {
            text: translate('default.cancel'),
            style: 'cancel',
          },
          {
            text: translate('default.ok'),
            onPress: async () => {
              console.log('database', database);
              if (!database) {
                return;
              }
              await database.closeAsync();
              await deleteDatabaseAsync(currentDatabaseName);
              await onOpenDatabase({
                currentDatabaseName: currentDatabaseName,
                shouldClose: false,
              });
              showSuccessMessage(translate('prompt.clear_database.success_message')); // Update this if you want a specific message
            },
          },
        ],
      );
    } catch (error) {
      console.log('error', error);
      showErrorMessage(translate('prompt.clear_database.error_message')); // Localized error message
    }
  };

  const handleClearDatabase = async () => {
    try {
      Alert.alert(
        translate('prompt.clear_database.title'),
        translate('prompt.clear_database.message'),
        [
          {
            text: translate('default.cancel'),
            style: 'cancel',
          },
          {
            text: translate('default.ok'),
            onPress: async () => {
              await onDeleteDatabase(database);
              showSuccessMessage(translate('prompt.clear_database.success_message'));
            },
          },
        ],
      );
    } catch (error) {
      console.log('error', error);
      showErrorMessage(translate('prompt.clear_database.error_message'));
    }
  };

  const handleDeleteCloudVault = async () => {
    try {
      Alert.alert(
        translate('prompt.delete_cloud_vault.title', { currentDatabaseName }),
        translate('prompt.delete_cloud_vault.message'),
        [
          {
            text: translate('default.cancel'),
            style: 'cancel',
          },
          {
            text: translate('default.ok'),
            onPress: async () => {
              if (!database) {
                return;
              }
              await onDeleteGroup({ groupId: currentGroupId });
              await database.closeAsync();
              await deleteDatabaseAsync(currentDatabaseName);

              updateProfile({
                groupId: Env.TEST_GROUP_ID,
                groupName: Env.SQLITE_DB_NAME,
                groupRole: 'read_write',
              });
              setResetDatabase();
              await onOpenDatabase({
                currentDatabaseName: Env.SQLITE_DB_NAME,
                shouldClose: false,
              });

              showSuccessMessage(translate('advance_settings.success.deleting_vault'));
            },
          },
        ],
      );
    } catch (error) {
      console.log('error', error);
      showErrorMessage(translate('advance_settings.errors.deleting_vault'));
    }
  };

  const { styles } = useStyles(stylesheet);

  return (
    <SettingsContainer title={translate('advance_settings.title')}>
      <View style={styles.dangerZoneContainer}>
        <Typography variant={'titleLarge'} style={styles.dangerZoneTitle}>
          {translate('advance_settings.danger_zone')}
        </Typography>
        <Typography variant={'bodyMedium'}>
          {translate('advance_settings.danger_zone_description')}
        </Typography>
        <SettingsButton
          title={translate('advance_settings.clear_all_recipes')}
          onPress={handleClearDatabase}
          iconSource={'bin'}
        />
        <SettingsButton
          title={translate('advance_settings.delete_reset_vault')}
          onPress={handleResetDatabase}
          iconSource={'bin'}
        />
        {currentGroupId !== Env.TEST_GROUP_ID && (
          <SettingsButton
            title={translate('advance_settings.delete_cloud_vault')}
            onPress={handleDeleteCloudVault}
            iconSource={'bin'}
          />
        )}
      </View>
    </SettingsContainer>
  );
};

export default AdvanceDatabaseSettings;
