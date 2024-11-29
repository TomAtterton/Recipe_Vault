import { StateCreator } from 'zustand';
import { sliceResetFns } from '@/store/helper';

export type AppSlice = {
  hasOnboarded: boolean;
  setHasOnboarded: (hasOnboarded: boolean) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  hasReminderPermission: boolean;
  setHasReminderPermission: (hasReminderPermission: boolean) => void;
  hasSeenMigrationPrompt: boolean;
  setHasSeenMigrationPrompt: (hasSeenMigrationPrompt: boolean) => void;
};

const initialAppState = {
  hasOnboarded: false,
  darkMode: true,
  hasReminderPermission: false,
  hasSeenMigrationPrompt: false,
};

export const createAppSlice: StateCreator<AppSlice, [], [], AppSlice> = (set) => {
  sliceResetFns.add(() => set(initialAppState));
  return {
    ...initialAppState,
    setHasOnboarded: (hasOnboarded) => set({ hasOnboarded }),
    setDarkMode: (darkMode) => set({ darkMode }),
    setHasReminderPermission: (hasReminderPermission) => set({ hasReminderPermission }),
    setHasSeenMigrationPrompt: (hasSeenMigrationPrompt) => set({ hasSeenMigrationPrompt }),
  };
};
