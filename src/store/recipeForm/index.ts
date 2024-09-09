import { StateCreator } from 'zustand';
import { sliceResetFns } from '@/store/helper';
import { RecipeFormType } from '@/utils/recipeFormUtil';

export type RecipeFormSlice = {
  scannedRecipe?: Partial<RecipeFormType>;
  setScannedRecipe: (scannedRecipe?: Partial<RecipeFormType>) => void;
};

const initialRecipeFormState = {
  scannedRecipe: undefined,
};

export const createRecipeFormSlice: StateCreator<RecipeFormSlice, [], [], RecipeFormSlice> = (
  set,
) => {
  sliceResetFns.add(() => set(initialRecipeFormState));
  return {
    ...initialRecipeFormState,
    setScannedRecipe: (scannedRecipe) => set({ scannedRecipe }),
  };
};
