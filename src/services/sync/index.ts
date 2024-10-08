import { syncPush } from '@/services/sync/syncPush';
import { syncPull } from '@/services/sync/syncPull';
import { useBoundStore } from '@/store';
import { syncDelete } from '@/services/sync/syncDelete';
import debounce from 'lodash/debounce';

let isSyncing = false;

const performSync = async () => {
  if (isSyncing) {
    return;
  }

  try {
    isSyncing = true;
    await syncDelete();
    await syncPush();
    await syncPull();
  } catch (error) {
    console.error('syncWithSupabase error', error);
  } finally {
    isSyncing = false;
  }
};

export const syncWithSupabase = debounce(
  async () => {
    const shouldSync = useBoundStore.getState().shouldSync;
    if (!shouldSync) {
      console.log('Sync not required. Skipping.');
      return;
    }
    await performSync();
  },
  1000,
  { leading: true, trailing: false },
);
