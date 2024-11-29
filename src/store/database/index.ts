import { StateCreator } from 'zustand';
import { sliceResetFns } from '@/store/helper';
import { Env } from '@/core/env';
import { translate } from '@/core';
import { DatabaseObject } from '@/types';

export const localDatabase = {
  id: Env.LOCAL_GROUP_ID,
  name: translate('database_settings.local_vault'),
  icon: 'vault',
  isShared: false,
} as DatabaseObject;

export type DatabaseSlice = {
  //
  currentDatabaseName: string;
  setCurrentDatabaseName: (currentDatabaseName: string) => void;
  //
  databases: DatabaseObject[];
  setDatabases: (databases: DatabaseObject[]) => void;
  //
  shouldSync: boolean;
  setShouldSync: (shouldSync: boolean) => void; // TODO if we're logged in maybe that's enough to know to sync ?
  //
  lastSynced?: string;
  setLastSynced: (lastSynced?: string) => void;
  //
  setResetDatabase: () => void;
};

const initialDatabaseState = {
  currentDatabaseName: Env.SQLITE_DB_NAME,
  shouldSync: false,
  lastSynced: undefined,
  databases: [localDatabase],
};

export const createDatabaseSlice: StateCreator<DatabaseSlice, [], [], DatabaseSlice> = (set) => {
  sliceResetFns.add(() => set(initialDatabaseState));

  return {
    ...initialDatabaseState,
    setDatabases: (databases) => set({ databases }),
    setShouldSync: (shouldSync) => set({ shouldSync }),
    setLastSynced: (lastSynced) => set({ lastSynced }),
    setCurrentDatabaseName: (currentDatabaseName) => set({ currentDatabaseName }),
    setResetDatabase: () => set(initialDatabaseState),
  };
};
