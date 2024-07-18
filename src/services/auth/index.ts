import { supabase } from '@/services';
import { Env } from '@/core/env';
import * as AppleAuthentication from 'expo-apple-authentication';
import { translate } from '@/core';

export const onSignOut = async () => supabase.auth.signOut();

export const onTestSignIn = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    // @ts-ignore
    email: Env.TEST_LOGIN_EMAIL,
    // @ts-ignore
    password: Env.TEST_LOGIN_PASSWORD,
  });

  return { data, error };
};

export const onAppleAuthSignIn = async () => {
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
    return { data, error };
  }
  throw new Error(translate('error_messages.no_identity_token'));
};

export const onDeleteUser = async () => {
  const { error } = await supabase.functions.invoke('delete-user');

  return { error };
};
