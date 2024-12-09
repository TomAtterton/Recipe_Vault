import Share from 'react-native-share';
import { translate } from '@/core';
import { Platform } from 'react-native';
import { Env } from '@/core/env';
import { ShareOptions } from 'react-native-share/src/types';

const googlePlayUrl = 'https://play.google.com/store/apps/details?id=con.tomatterton.advent';

export const onShareApp = async () => {
  try {
    await onShare(
      translate('share_app.title'),
      translate('share_app.message'),
      Platform.OS === 'android' ? googlePlayUrl : Env.APP_STORE_URL,
      { showAppsToView: true },
    );
  } catch (error) {
    console.error(error);
  }
};

export const onShareVault = async (invitationCode: string) => {
  const generatedUrl = `https://recipevault.nl/share?code=${invitationCode}`;
  try {
    await onShare(
      'Share database code with a friend',
      'Join my vault and explore amazing recipes!',
      generatedUrl,
      {
        showAppsToView: true,
      },
    );
  } catch (error) {
    console.error(error);
  }
};

export const onShare = async (
  title: string,
  message: string,
  url: string,
  options?: ShareOptions,
) => {
  try {
    await Share.open({
      title,
      message,
      url,
      type: 'text/plain',
      showAppsToView: true,
      ...options,
    });
  } catch (error) {
    throw error;
  }
};
