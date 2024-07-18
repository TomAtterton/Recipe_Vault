import { translate } from '@/core';
import { Session, User } from '@supabase/supabase-js';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { setCurrentDatabaseName, setShouldSync, updateProfile } from '@/store';
import { showErrorMessage } from '@/utils/promptUtils';
import { openDatabase } from '@/database';
import { syncWithSupabase } from '@/services/sync';
import { useState } from 'react';
import { profileGroup } from '@/services/profileGroup';
import { onAppleAuthSignIn, onTestSignIn } from '@/services/auth';

const useHandleAuth = () => {
  const { reset } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const handleUpdateProfile = async (data: { user: User | null; session: Session | null }) => {
    try {
      setIsLoading(true);

      const { groupId, groupName } = await profileGroup({
        userId: data.user?.id,
      });

      if (groupName && groupId) {
        updateProfile({
          id: data.user?.id,
          email: data?.user?.email || '',
          groupId,
          groupName,
        });
        setShouldSync(true);

        const currentDatabaseName = `${groupName}.db`;
        setCurrentDatabaseName(currentDatabaseName);
        await openDatabase({ currentDatabaseName });
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
