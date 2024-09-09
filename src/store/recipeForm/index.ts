import { StateCreator } from 'zustand';
import { sliceResetFns } from '@/store/helper';
import { RecipeFormType } from '@/utils/recipeFormUtil';
import { RecipeDetailType } from '@/types';

export type RecipeFormSlice = {
  scannedRecipe?: Partial<RecipeFormType>;
  webRecipe?: RecipeDetailType;
  setScannedRecipe: (scannedRecipe?: Partial<RecipeFormType>) => void;
  setWebRecipe: (webRecipe?: RecipeDetailType) => void;
};

const initialRecipeFormState = {
  scannedRecipe: undefined,
  webRecipe: undefined,
};

export const createRecipeFormSlice: StateCreator<RecipeFormSlice, [], [], RecipeFormSlice> = (
  set,
) => {
  sliceResetFns.add(() => set(initialRecipeFormState));
  return {
    ...initialRecipeFormState,
    setScannedRecipe: (scannedRecipe) => set({ scannedRecipe }),
    setWebRecipe: (webRecipe) => set({ webRecipe }),
  };
};
