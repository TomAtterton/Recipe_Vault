import { StateCreator } from 'zustand';
import { sliceResetFns } from '@/store/helper';

export type AppSlice = {
  hasOnboarded: boolean;
  setHasOnboarded: (hasOnboarded: boolean) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  invitationCode: string | undefined;
  setInvitationCode: (invitationCode: string | undefined) => void;
  hasReminderPermission: boolean;
  setHasReminderPermission: (hasReminderPermission: boolean) => void;
  hasSeenMigrationPrompt: boolean;
  setHasSeenMigrationPrompt: (hasSeenMigrationPrompt: boolean) => void;
  dismissedUpdateVersion: string | undefined;
  setDismissedUpdateVersion: (dismissedUpdateVersion: string | undefined) => void;
};

const initialAppState = {
  hasOnboarded: false,
  darkMode: true,
  hasReminderPermission: false,
  hasSeenMigrationPrompt: false,
  invitationCode: undefined,
  dismissedUpdateVersion: undefined,
};

export const createAppSlice: StateCreator<AppSlice, [], [], AppSlice> = (set) => {
  sliceResetFns.add(() => set(initialAppState));
  return {
    ...initialAppState,
    setHasOnboarded: (hasOnboarded) => set({ hasOnboarded }),
    setDarkMode: (darkMode) => set({ darkMode }),
    setHasReminderPermission: (hasReminderPermission) => set({ hasReminderPermission }),
    setHasSeenMigrationPrompt: (hasSeenMigrationPrompt) => set({ hasSeenMigrationPrompt }),
    setInvitationCode: (invitationCode) => set({ invitationCode }),
    setDismissedUpdateVersion: (dismissedUpdateVersion) => set({ dismissedUpdateVersion }),
  };
};
