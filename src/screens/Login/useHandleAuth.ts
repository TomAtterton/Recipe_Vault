import { translate } from '@/core';
import { Session, User } from '@supabase/supabase-js';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { setCurrentDatabaseName, setShouldSync, updateProfile } from '@/store';
import { showErrorMessage } from '@/utils/promptUtils';
import { onOpenDatabase } from '@/database';
import { syncWithSupabase } from '@/services/sync';
import { useState } from 'react';
import { onAppleAuthSignIn, onTestSignIn } from '@/services/auth';
import { getProfileGroup } from '@/services/group';

const useHandleAuth = () => {
  const { reset } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const handleUpdateProfile = async (data: { user: User | null; session: Session | null }) => {
    try {
      setIsLoading(true);

      const { groupId, groupName, groupRole } = await getProfileGroup({
        userId: data.user?.id,
      });

      if (groupName && groupId && groupRole) {
        updateProfile({
          id: data.user?.id,
          email: data?.user?.email || '',
          groupId,
          groupName,
          groupRole,
        });
        setShouldSync(true);

        const currentDatabaseName = `${groupName}.db`;
        setCurrentDatabaseName(currentDatabaseName);
        await onOpenDatabase({ currentDatabaseName });
        await syncWithSupabase();
        reset({
          index: 0,
          routes: [{ name: Routes.TabStack }],
        });
      } else {
        updateProfile({
          id: data.user?.id,
          email: data?.user?.email || '',
        });

        // TODO handle no group setup
        reset({
          index: 0,
          routes: [{ name: Routes.Profile }],
        });
      }
    } catch (e) {
      // @ts-ignore
      showErrorMessage(e?.message || translate('error_messages.default'));
    } finally {
      setIsLoading(false);
    }
  };

  const onAppleLogin = async () => {
    try {
      const { data, error } = await onAppleAuthSignIn();

      if (error) {
        throw error;
      }

      await handleUpdateProfile(data);
    } catch (e) {
      // @ts-ignore
      if (e?.code === 'ERR_REQUEST_CANCELED') {
        showErrorMessage(translate('error_messages.cancelled_sign_in'));
      } else {
        console.log('e', e);
        // @ts-ignore
        showErrorMessage(e?.message || translate('error_messages.default'));
      }
    }
  };

  const onTestLogin = async () => {
    try {
      const { error, data } = await onTestSignIn();

      if (error) {
        showErrorMessage(error?.message);
        throw error;
      }

      if (data) {
        await handleUpdateProfile(data);
      }
    } catch (e) {
      // @ts-ignore
      showErrorMessage(e?.message || translate('error_messages.default'));
      throw e;
    }
  };

  return {
    onAppleLogin,
    onTestLogin,
    isLoading,
  };
};

export default useHandleAuth;
