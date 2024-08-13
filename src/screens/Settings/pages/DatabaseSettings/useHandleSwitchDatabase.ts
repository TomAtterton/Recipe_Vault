import { translate } from '@/core';
import { setCurrentDatabaseName, setResetDatabase, updateProfile, useBoundStore } from '@/store';
import { Env } from '@/core/env';
import { onOpenDatabase } from '@/database';
import { showErrorMessage } from '@/utils/promptUtils';
import { getProfileGroups, getProfileGroupWithUserId } from '@/services/group';
import { checkIfPro } from '@/services/pro';
import { syncWithSupabase } from '@/services/sync';
import { Routes } from '@/navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

const useHandleSwitchDatabase = () => {
  const { navigate } = useNavigation();

  const setSyncEnabled = useBoundStore((state) => state.setShouldSync);

  const userId = useBoundStore((state) => state.profile?.id);
  const cloudId = useBoundStore((state) => state.session?.user.id);
  const currentGroupName = useBoundStore((state) => state.profile?.groupName);

  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    getProfileGroups({ userId: cloudId })
      .then((_) => {
        const parsedGroups = _.map((group) => ({
          id: group.group_id || '',
          name: group?.groups?.name || '',
        }));
        setGroups(parsedGroups);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }, [cloudId, userId]);

  const handleEnableCloudDatabase = async (id: string) => {
    if (!cloudId) {
      return navigate(Routes.Login, {
        showSkip: false,
      });
    } else {
      setSyncEnabled(true);
      //
      const { groupName: profileGroupName, groupRole } = await getProfileGroupWithUserId({
        userId: cloudId,
        groupId: id,
      });

      if (profileGroupName && groupRole) {
        updateProfile({
          groupId: id,
          groupName: profileGroupName,
          groupRole,
        });

        await checkIfPro();
        const currentDatabaseName = `${currentGroupName}.db`;
        setCurrentDatabaseName(currentDatabaseName);
        await onOpenDatabase({ currentDatabaseName });
        await syncWithSupabase();
      } else {
        navigate(Routes.Login, {
          showSkip: true,
        });
      }
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
  return { handleSwitchDatabase, groups };
};

export default useHandleSwitchDatabase;
