import { syncPush } from '@/services/sync/syncPush';
import { syncPull } from '@/services/sync/syncPull';
import { useBoundStore } from '@/store';
import { syncDelete } from '@/services/sync/syncDelete';

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
