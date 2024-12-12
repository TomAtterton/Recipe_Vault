import { translate } from '@/core';
import { updateProfile, useBoundStore } from '@/store';
import { Env } from '@/core/env';
import { showErrorMessage } from '@/utils/promptUtils';
import { Routes } from '@/navigation/Routes';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import useUserId from '@/hooks/common/useUserId';
import { getProfileGroups, getProfileGroupWithUserId } from '@/services/profileGroup';
import useIsLoggedIn from '@/hooks/common/useIsLoggedIn';
import { localDatabase } from '@/store/database';
import { setupDatabase } from '@/utils/databaseUtils';

const useHandleSwitchDatabase = () => {
  const { navigate } = useNavigation();

  const setSyncEnabled = useBoundStore((state) => state.setShouldSync);
  const databases = useBoundStore((state) => state.databases);
  const setDatabases = useBoundStore((state) => state.setDatabases);

  const userId = useUserId();
  const isLogged = useIsLoggedIn();

  useFocusEffect(
    useCallback(() => {
      const fetchDatabases = async () => {
        if (!isLogged) {
          return setDatabases([localDatabase]);
        }
        try {
          const profileGroups = await getProfileGroups({ userId });
          const parsedGroups = profileGroups.map((group) => ({
            id: group.group_id || '',
            name: group?.groups?.name || '',
            icon: group?.created_by !== userId ? 'people' : 'cloud',
            isShared: group?.created_by !== userId,
          }));
          setDatabases([...parsedGroups, localDatabase]);
        } catch (_) {
          setDatabases([localDatabase]);
        }
      };

      fetchDatabases();
    }, [isLogged, setDatabases, userId]),
  );

  const handleEnableCloudDatabase = async (id: string) => {
    try {
      if (!userId) {
        return navigate(Routes.Login, {
          showSkip: false,
        });
      } else {
        setSyncEnabled(true);

        const { groupName: profileGroupName, groupRole } = await getProfileGroupWithUserId({
          userId,
          groupId: id,
        });

        if (profileGroupName && groupRole) {
          updateProfile({
            groupId: id,
            groupName: profileGroupName,
            groupRole,
          });

          if (!profileGroupName) {
            throw new Error('No current database name');
          }

          await setupDatabase({ databaseName: profileGroupName });
        } else {
          navigate(Routes.Login, {
            showSkip: true,
          });
        }
      }
    } catch (error) {
      console.log('error', error);
      showErrorMessage(translate('default.error_message'));
    }
  };

  const handleEnableLocalDatabase = async () => {
    try {
      await setupDatabase({ databaseName: Env.SQLITE_DB_NAME });
    } catch (error) {
      console.log('error', error);
      showErrorMessage(translate('default.error_message'));
    }
  };

  const handleSwitchDatabase = async (id: string) => {
    const isLocal = id === Env.LOCAL_GROUP_ID;

    Alert.alert(
      isLocal
        ? translate('prompt.switch_vault.local_title')
        : translate('prompt.switch_vault.cloud_title'),
      isLocal
        ? translate('prompt.switch_vault.local_message')
        : translate('prompt.switch_vault.cloud_message'),
      [
        {
          text: translate('default.cancel'),
          style: 'cancel',
        },
        {
          text: translate('default.ok'),
          onPress: async () => {
            if (isLocal) {
              await handleEnableLocalDatabase();
            } else {
              await handleEnableCloudDatabase(id);
            }
          },
        },
      ],
    );
  };

  const hasMaxDatabases = databases.length >= 8;
  return {
    handleSwitchDatabase,
    availableGroups: databases || [],
    hasMaxDatabases,
  };
};

export default useHandleSwitchDatabase;
