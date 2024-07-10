import { showMessage } from 'react-native-flash-message';
import { translate } from '@/core';

export const showSuccessMessage = (message: string) => {
  showMessage({
    message: 'Success',
    description: message,
    type: 'success',
    duration: 1000,
    icon: 'success',
  });
};

export const showErrorMessage = (message: string) => {
  showMessage({
    message: 'Error',
    description: message || translate('error_messages.default'),
    type: 'danger',
    duration: 1000,
    icon: 'danger',
  });
};
