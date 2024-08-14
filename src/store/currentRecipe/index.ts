import { StateCreator } from 'zustand';
import { sliceResetFns } from '@/store/helper';

export type CurrentRecipeSlice = {
  currentServings: number;
  setCurrentServings: (currentServings: number) => void;
};

const initialCurrentRecipeState = {
  currentServings: 0,
};

export const createCurrentRecipeSlice: StateCreator<
  CurrentRecipeSlice,
  [],
  [],
  CurrentRecipeSlice
> = (set) => {
  sliceResetFns.add(() => set(initialCurrentRecipeState));
  return {
    ...initialCurrentRecipeState,
    setCurrentServings: (currentServings) => set({ currentServings }),
  };
};
