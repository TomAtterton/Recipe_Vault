import { translate } from '@/core';
import { setCurrentDatabaseName, setResetDatabase, updateProfile, useBoundStore } from '@/store';
import { Env } from '@/core/env';
import { onOpenDatabase } from '@/database';
import { showErrorMessage } from '@/utils/promptUtils';
import { checkIfPro } from '@/services/pro';
import { syncWithSupabase } from '@/services/sync';
import { Routes } from '@/navigation/Routes';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import useUserId from '@/hooks/common/useUserId';
import { getProfileGroups, getProfileGroupWithUserId } from '@/services/profileGroup';

const useHandleSwitchDatabase = () => {
  const { navigate } = useNavigation();

  const setSyncEnabled = useBoundStore((state) => state.setShouldSync);

  const userId = useUserId();

  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);

  useFocusEffect(
    useCallback(() => {
      getProfileGroups({ userId }).then((_) => {
        const parsedGroups = _.map((group) => ({
          id: group.group_id || '',
          name: group?.groups?.name || '',
        }));
        setGroups(parsedGroups);
      });
    }, [userId])
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

          await checkIfPro();
          if (!profileGroupName) {
            throw new Error('No current database name');
          }

          setCurrentDatabaseName(profileGroupName);

          await onOpenDatabase({ currentDatabaseName: profileGroupName });

          await syncWithSupabase();
        } else {
          navigate(Routes.Login, {
            showSkip: true,
          });
        }
      }
    } catch (error) {
      console.log('error', error);
      showErrorMessage(translate('error.default.error_message', 3000));
    }
  };

  const handleEnableLocalDatabase = async () => {
    try {
      updateProfile({
        id: Env.TEST_USER_ID,
        groupId: Env.TEST_GROUP_ID,
        groupName: Env.SQLITE_DB_NAME,
        groupRole: 'read_write',
      });

      setResetDatabase();
      setSyncEnabled(false);
      await onOpenDatabase({ currentDatabaseName: Env.SQLITE_DB_NAME });
    } catch (error) {
      showErrorMessage(translate('error.default.error_message', 3000));
    }
  };

  const handleSwitchDatabase = async (id: string) => {
    const isLocal = id === Env.TEST_GROUP_ID;

    Alert.alert(
      isLocal ? 'Switch to local vault?' : 'Switch to cloud vault?',
      isLocal
        ? 'Will disable cloud sync and switch to local vault.'
        : 'Will enable cloud sync and switch to cloud vault.',
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
      ]
    );
  };
  return { handleSwitchDatabase, availableGroups: groups };
};

export default useHandleSwitchDatabase;
