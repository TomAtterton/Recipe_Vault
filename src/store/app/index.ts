import { StateCreator } from 'zustand';
import { sliceResetFns } from '@/store/helper';

export type AppSlice = {
  hasOnboarded: boolean;
  darkMode: boolean;
  isBetaMode: boolean;
  setHasOnboarded: (hasOnboarded: boolean) => void;
  setDarkMode: (darkMode: boolean) => void;
  setBetaMode: (isBetaMode: boolean) => void;
};

const initialAppState = {
  hasOnboarded: false,
  darkMode: true,
  isBetaMode: false,
};

export const createAppSlice: StateCreator<AppSlice, [], [], AppSlice> = (set) => {
  sliceResetFns.add(() => set(initialAppState));
  return {
    ...initialAppState,
    setHasOnboarded: (hasOnboarded) => set({ hasOnboarded }),
    setBetaMode: (isBetaMode) => set({ isBetaMode }),
    setDarkMode: (darkMode) => set({ darkMode }),
  };
};
