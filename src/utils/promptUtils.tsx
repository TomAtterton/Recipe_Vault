import React from 'react';
import Toast, { ToastConfig } from 'react-native-toast-message';
import RNToast from '@/components/Toast';
import { reloadAsync } from 'expo-updates';

export const showSuccessMessage = (message: string) => {
  Toast.show({
    type: 'success',
    text2: message,
    visibilityTime: 2000,
    autoHide: true,
    swipeable: true,
  });
};

export const showErrorMessage = (message: string, duration?: number) => {
  Toast.show({
    type: 'error',
    text2: message,
    visibilityTime: duration || 2000,
    autoHide: true,
    swipeable: true,
  });
};

export const showUpdateMessage = () => {
  Toast.show({
    type: 'update',
    text2: 'An update is available',
    autoHide: false,
    onPress: () => {
      Toast.hide();
      reloadAsync();
    },
  });
};

export const toastConfig: ToastConfig = {
  success: (props) => <RNToast {...props} type={'success'} />,
  error: (props) => <RNToast {...props} type={'error'} />,
  update: (props) => <RNToast {...props} type={'update'} />,
};
