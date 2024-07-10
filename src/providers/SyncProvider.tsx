import { useEffect } from 'react';
import React from 'react';
import { addDatabaseChangeListener } from 'expo-sqlite/next';
import { useBoundStore } from '@/store';
import { syncWithSupabase } from '@/database/supabase/syncUtils';
import { showErrorMessage } from '@/utils/promptUtils';
import { database } from '@/database';

const SyncProvider = ({ children }: { children: React.ReactNode }) => {
  const shouldSync = useBoundStore((state) => state.shouldSync);

  useEffect(() => {
    const sortData = async () => {
      if (shouldSync && database) {
        syncWithSupabase().catch((err) => {
          console.log(err);
          showErrorMessage('Error syncing with Backend');
        });
      }
    };

    sortData();

    const listener = addDatabaseChangeListener((event) => {
      console.log('Database CHANGED', event);
      const tableName = event.tableName;
      console.log('Database CHANGED', tableName);
    });
    return () => {
      listener.remove();
    };
  }, [shouldSync]);
  return <>{children}</>;
};

export default SyncProvider;
