import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { syncWithSupabase } from '@/database/supabase/syncUtils';
import { useBoundStore } from '@/store';

const useSyncOnFocus = () => {
  const shouldSync = useBoundStore((state) => state.shouldSync);

  useFocusEffect(
    useCallback(() => {
      if (shouldSync) {
        syncWithSupabase();
      }
    }, [shouldSync])
  );
};

export default useSyncOnFocus;
