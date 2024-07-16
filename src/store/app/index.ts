import { StateCreator } from 'zustand';
import { sliceResetFns } from '@/store/helper';

export type AppSlice = {
  hasOnboarded: boolean;
  setHasOnboarded: (hasOnboarded: boolean) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
};

const initialAppState = {
  hasOnboarded: false,
  darkMode: true,
};

export const createAppSlice: StateCreator<AppSlice, [], [], AppSlice> = (set) => {
  sliceResetFns.add(() => set(initialAppState));
  return {
    ...initialAppState,
    setHasOnboarded: (hasOnboarded) => set({ hasOnboarded }),
    setDarkMode: (darkMode) => set({ darkMode }),
  };
};
