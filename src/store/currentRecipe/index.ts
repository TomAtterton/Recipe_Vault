import { StateCreator } from 'zustand';
import { sliceResetFns } from '@/store/helper';
import { RecipeUnit } from '@/utils/ingredientsUtil';

export type CurrentRecipeSlice = {
  currentRecipeUnit: RecipeUnit;
  currentServings: number;
  setCurrentServings: (currentServings: number) => void;
  setCurrentRecipeUnit: (currentRecipeUnit: RecipeUnit) => void;
};

const initialCurrentRecipeState = {
  currentServings: 0,
  currentRecipeUnit: 'metric' as RecipeUnit,
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
    setCurrentRecipeUnit: (currentRecipeUnit) => set({ currentRecipeUnit }),
  };
};
