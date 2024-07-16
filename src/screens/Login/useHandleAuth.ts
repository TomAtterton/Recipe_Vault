import * as AppleAuthentication from 'expo-apple-authentication';

import { translate } from '@/core';
import { supabase } from '@/database/supabase';
import { Env } from '@/core/env';
import { Session, User } from '@supabase/supabase-js';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { setCurrentDatabaseName, setShouldSync, updateProfile } from '@/store';
import { showErrorMessage } from '@/utils/promptUtils';
import { openDatabase } from '@/database';
import { syncWithSupabase } from '@/database/supabase/syncUtils';
import { useState } from 'react';
import { getProfileGroup } from '@/database/supabase/getProfileGroup';

const useHandleAuth = () => {
  const { reset } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const handleUpdateProfile = async (data: { user: User | null; session: Session | null }) => {
    try {
      setIsLoading(true);

      const { groupId, groupName } = await getProfileGroup({
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
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.identityToken) {
        const { error, data } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });

        if (data) {
          await handleUpdateProfile(data);
        }

        if (error) {
          throw error;
        }
      } else {
        throw new Error(translate('error_messages.no_identity_token'));
      }
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
      const { data, error } = await supabase.auth.signInWithPassword({
        // @ts-ignore
        email: Env.TEST_LOGIN_EMAIL,
        // @ts-ignore
        password: Env.TEST_LOGIN_PASSWORD,
      });

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
