import React from 'react';
import { useUpdates, fetchUpdateAsync, checkForUpdateAsync } from 'expo-updates';
import { useEffect } from 'react';
import { showUpdateMessage } from '@/utils/promptUtils';
import { useAppState } from '@/hooks/common/useAppState';

interface Props {
  children: React.ReactNode;
}

const UpdateProvider = ({ children }: Props) => {
  const { isUpdateAvailable, isUpdatePending } = useUpdates();

  useAppState((status) => {
    if (__DEV__) return;
    if (status === 'active') {
      checkForUpdateAsync();
    }
  });

  useEffect(() => {
    if (isUpdateAvailable) {
      fetchUpdateAsync();
    }
  }, [isUpdateAvailable]);

  useEffect(() => {
    if (isUpdatePending) {
      showUpdateMessage();
    }
  }, [isUpdatePending]);

  return children;
};

export default UpdateProvider;
