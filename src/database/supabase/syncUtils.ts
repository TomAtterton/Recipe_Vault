import { syncPush } from '@/database/supabase/syncPush';
import { syncPull } from '@/database/supabase/syncPull';
import { useBoundStore } from '@/store';
import { syncDelete } from '@/database/supabase/syncDelete';

export const syncWithSupabase = async () => {
  try {
    const shouldSync = useBoundStore.getState().shouldSync;
    if (!shouldSync) {
      return;
    }
    await syncDelete();
    await syncPush();
    await syncPull();
  } catch (error) {
    console.log('syncWithSupabase error', error);
  }
};
