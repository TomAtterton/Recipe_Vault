import { subMinutes, parseISO } from 'date-fns';
import { useBoundStore } from '@/store';

const OLD_TIMESTAMP = '2021-01-01T00:00:00.000Z';
const OFFSET_MINUTES = 5;

export const getLastSynced = (forceOld = false) => {
  if (forceOld) {
    return OLD_TIMESTAMP;
  }

  const lastSynced = useBoundStore.getState()?.lastSynced;

  if (!lastSynced) {
    return OLD_TIMESTAMP;
  }

  return subMinutes(parseISO(lastSynced), OFFSET_MINUTES).toISOString();
};
