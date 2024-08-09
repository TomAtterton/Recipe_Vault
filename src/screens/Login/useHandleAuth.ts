import { translate } from '@/core';
import { Session, User } from '@supabase/supabase-js';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { showErrorMessage } from '@/utils/promptUtils';
import { useState } from 'react';
import { onAppleAuthSignIn, onTestSignIn } from '@/services/auth';
import { getProfileGroup } from '@/services/group';
import { updateProfile } from '@/store';

const useHandleAuth = () => {
  const { reset } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const handleUpdateProfile = async (data: { user: User | null; session: Session | null }) => {
    try {
      setIsLoading(true);
      const { groupId, profileName } = await getProfileGroup({
        userId: data.user?.id,
      });

      updateProfile({
        id: data.user?.id,
        email: data?.user?.email || '',
      });

      if (groupId && profileName) {
        reset({
          index: 0,
          routes: [
            { name: Routes.TabStack },
            { name: Routes.Settings },
            { name: Routes.DatabaseSettings },
          ],
        });
      } else {
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
