import { StateCreator } from 'zustand';
import { sliceResetFns } from '@/store/helper';

export type DatabaseSlice = {
  currentDatabaseName: string;
  shouldSync: boolean;
  setShouldSync: (shouldSync: boolean) => void;
  lastSynced?: string;
  setLastSynced: (lastSynced?: string) => void;
  setCurrentDatabaseName: (currentDatabaseName: string) => void;
  setResetDatabase: () => void;
};

const initialDatabaseState = {
  currentDatabaseName: 'recipe_vault.db',
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
  };
};
