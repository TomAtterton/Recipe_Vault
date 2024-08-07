import { StateCreator } from 'zustand';
import { sliceResetFns } from '@/store/helper';
import { Env } from '@/core/env';

export type DatabaseSlice = {
  currentDatabaseName: string;
  databaseStatus: string;
  shouldSync: boolean;
  setShouldSync: (shouldSync: boolean) => void;
  lastSynced?: string;
  setLastSynced: (lastSynced?: string) => void;
  setCurrentDatabaseName: (currentDatabaseName: string) => void;
  setResetDatabase: () => void;
  setDatabaseStatus: (databaseStatus: 'free' | 'pro') => void;
};

const initialDatabaseState = {
  currentDatabaseName: Env.SQLITE_DB_NAME,
  databaseStatus: 'free',
  shouldSync: false,
  lastSynced: undefined,
};

export const createDatabaseSlice: StateCreator<DatabaseSlice, [], [], DatabaseSlice> = (set) => {
  sliceResetFns.add(() => set(initialDatabaseState));

  return {
    ...initialDatabaseState,
    setShouldSync: (shouldSync) => set({ shouldSync }),
    setLastSynced: (lastSynced) => set({ lastSynced }),
    setCurrentDatabaseName: (currentDatabaseName) => set({ currentDatabaseName }),
    setResetDatabase: () => set(initialDatabaseState),
    setDatabaseStatus: (databaseStatus) => set({ databaseStatus }),
  };
};
