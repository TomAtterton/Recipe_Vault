import React from 'react';
import { useUpdates, fetchUpdateAsync, reloadAsync } from 'expo-updates';
import { useEffect } from 'react';
import { showErrorMessage } from '@/utils/errorUtils';

interface Props {
  children: React.ReactNode;
}

const UpdateProvider = ({ children }: Props) => {
  const { isUpdateAvailable } = useUpdates();
  const handleUpdate = async () => {
    try {
      await fetchUpdateAsync();
      await reloadAsync();
      showErrorMessage('App updated');
    } catch (error) {
      // @ts-ignore
      showErrorMessage('Error updating app ' + error?.message);
    }
  };

  useEffect(() => {
    if (isUpdateAvailable) {
      handleUpdate();
    }
  }, [isUpdateAvailable]);

  return children;
};

export default UpdateProvider;
