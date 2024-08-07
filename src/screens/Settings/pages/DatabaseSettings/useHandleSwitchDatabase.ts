import { Alert } from 'react-native';
import { translate } from '@/core';
import { setCurrentDatabaseName, setResetDatabase, updateProfile, useBoundStore } from '@/store';
import { Env } from '@/core/env';
import { onOpenDatabase } from '@/database';
import { showErrorMessage } from '@/utils/promptUtils';
import { getProfileGroup } from '@/services/group';
import { checkIfPro } from '@/services/pro';
import { syncWithSupabase } from '@/services/sync';
import { Routes } from '@/navigation/Routes';
import { useNavigation } from '@react-navigation/native';

const useHandleSwitchDatabase = () => {
  const { navigate } = useNavigation();

  const isSyncEnabled = useBoundStore((state) => state.shouldSync);
  const setSyncEnabled = useBoundStore((state) => state.setShouldSync);
  const userId = useBoundStore((state) => state.profile?.id);
  const cloudId = useBoundStore((state) => state.profile?.cloudId);
  const groupName = useBoundStore((state) => state.profile?.groupName);

  const handleEnableSync = async () => {
    if (!cloudId) {
      return navigate(Routes.Login, {
        showSkip: false,
      });
    } else {
      setSyncEnabled(true);
      //
      const {
        groupId,
        groupName: profileGroupName,
        groupRole,
      } = await getProfileGroup({
        userId: cloudId,
      });

      if (groupId && profileGroupName && groupRole) {
        //
        updateProfile({
          groupId,
          groupName: profileGroupName,
          groupRole,
        });
        await checkIfPro();
        const currentDatabaseName = `${groupName}.db`;
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

  const handleDisableSync = async () => {
    try {
      updateProfile({
        cloudId: userId,
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

  const handleSwitchDatabase = () => {
    Alert.alert(
      isSyncEnabled ? 'Switch to local vault?' : 'Switch to cloud vault?',
      isSyncEnabled
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
            if (isSyncEnabled) {
              await handleDisableSync();
            } else {
              await handleEnableSync();
            }
          },
        },
      ]
    );
  };
  return { handleSwitchDatabase };
};

export default useHandleSwitchDatabase;
