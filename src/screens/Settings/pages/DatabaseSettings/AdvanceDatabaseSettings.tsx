import { Alert, View } from 'react-native';
import { translate } from '@/core';
import { database, onResetToDefaultDatabase } from '@/database';
import { showErrorMessage, showSuccessMessage } from '@/utils/promptUtils';
import { deleteDatabaseAsync } from 'expo-sqlite';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Typography from '@/components/Typography';
import * as React from 'react';
import { onDeleteGroup } from '@/services/group';
import { updateProfile } from '@/store';
import { Env } from '@/core/env';
import SettingsContainer from '@/components/SettingsContainer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@/navigation/types';
import { Routes } from '@/navigation/Routes';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import OutlineButton from '@/components/buttons/OutlineButton';
import { useMemo, useState } from 'react';
import { onDeleteProfileGroup } from '@/services/profileGroup';
import { getUserId } from '@/hooks/common/useUserId';

const AdvanceDatabaseSettings = () => {
  const route = useRoute<RouteProp<Routes.AdvanceVaultSettings>>();
  const { id: currentGroupId, name: currentDatabaseName, isShared } = route.params;
  const navigation = useNavigation();

  const isLocal = currentGroupId === Env.LOCAL_GROUP_ID;
  const [isLoading, setIsLoading] = useState(false);

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
              try {
                setIsLoading(true);

                await database.closeAsync();
                await deleteDatabaseAsync(`${currentDatabaseName}.db`);

                if (isShared) {
                  const userId = getUserId();
                  await onDeleteProfileGroup({ groupId: currentGroupId, userId: userId });
                } else {
                  await onDeleteGroup({ groupId: currentGroupId });
                }

                updateProfile({
                  groupId: Env.LOCAL_GROUP_ID,
                  groupName: Env.SQLITE_DB_NAME,
                  groupRole: 'read_write',
                });

                await onResetToDefaultDatabase({ shouldClose: false });

                showSuccessMessage(translate('advance_settings.success.deleting_vault'));

                navigation.reset({
                  index: 0,
                  routes: [{ name: Routes.TabStack }],
                });
              } catch (error) {
                showErrorMessage(translate('advance_settings.errors.deleting_vault'));
                console.log('error deleting vault', error);
              } finally {
                setIsLoading(false);
              }
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
  const vaultButtonTitle = useMemo(() => {
    if (isLocal) {
      return translate('advance_settings.local_vault');
    }
    return isShared
      ? translate('advance_settings.cloud_vault')
      : translate('advance_settings.shared_vault');
  }, [isLocal, isShared]);
  return (
    <SettingsContainer title={translate('advance_settings.title')}>
      <View style={styles.buttonContainer}>
        <InfoLabelButton
          title={translate('sync_settings.current_vault')}
          buttonTitle={currentDatabaseName}
        />
        <InfoLabelButton
          title={translate('advance_settings.vault_type')}
          buttonTitle={vaultButtonTitle}
        />
      </View>
      <View style={styles.dangerZoneContainer}>
        <Typography variant={'titleLarge'} style={styles.dangerZoneTitle}>
          {translate('advance_settings.danger_zone')}
        </Typography>
        <Typography variant={'bodyMedium'}>
          {translate('advance_settings.danger_zone_description')}
        </Typography>

        {!isLocal && (
          <OutlineButton
            title={
              isShared
                ? translate('advance_settings.leave_cloud_vault')
                : translate('advance_settings.delete_cloud_vault')
            }
            onPress={handleDeleteCloudVault}
            iconSource={'bin'}
            isLoading={isLoading}
          />
        )}
      </View>
    </SettingsContainer>
  );
};
const stylesheet = createStyleSheet((theme) => ({
  buttonContainer: { flex: 1 },
  dangerZoneTitle: {
    color: theme.colors.primary,
  },
  dangerZoneContainer: {
    paddingTop: 20,
    gap: 16,
    paddingBottom: 20,
  },
}));

export default AdvanceDatabaseSettings;
// {/*<SettingsButton*/}
// {/*  title={translate('advance_settings.clear_all_recipes')}*/}
// {/*  onPress={handleClearDatabase}*/}
// {/*  iconSource={'bin'}*/}
// {/*/>*/}
// {/*<SettingsButton*/}
// {/*  title={translate('advance_settings.delete_reset_vault')}*/}
// {/*  onPress={handleResetDatabase}*/}
// {/*  iconSource={'bin'}*/}
// {/*/>*/}
// const handleResetDatabase = async () => {
//   try {
//     Alert.alert(
//       translate('prompt.reset_database.title'),
//       translate('prompt.reset_database.message'),
//       [
//         {
//           text: translate('default.cancel'),
//           style: 'cancel',
//         },
//         {
//           text: translate('default.ok'),
//           onPress: async () => {
//             console.log('database', database);
//             if (!database) {
//               return;
//             }
//             await database.closeAsync();
//             await deleteDatabaseAsync(currentDatabaseName);
//             await onOpenDatabase({
//               currentDatabaseName: currentDatabaseName,
//               shouldClose: false,
//             });
//             showSuccessMessage(translate('prompt.clear_database.success_message')); // Update this if you want a specific message
//           },
//         },
//       ],
//     );
//   } catch (error) {
//     console.log('error', error);
//     showErrorMessage(translate('prompt.clear_database.error_message')); // Localized error message
//   }
// };
//
// const handleClearDatabase = async () => {
//   try {
//     Alert.alert(
//       translate('prompt.clear_database.title'),
//       translate('prompt.clear_database.message'),
//       [
//         {
//           text: translate('default.cancel'),
//           style: 'cancel',
//         },
//         {
//           text: translate('default.ok'),
//           onPress: async () => {
//             await onDeleteDatabase(database);
//             showSuccessMessage(translate('prompt.clear_database.success_message'));
//           },
//         },
//       ],
//     );
//   } catch (error) {
//     console.log('error', error);
//     showErrorMessage(translate('prompt.clear_database.error_message'));
//   }
// };
