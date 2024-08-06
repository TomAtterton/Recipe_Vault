import { supabase } from '@/services';
import {
  convertRecipeIngredientInstructions,
  convertTimeToString,
} from '@/screens/RecipeWebview/utils/translateWebview';

export const generateRecipe = async (query: string) => {
  if (!query) {
    throw new Error('No query provided');
  }

  if (query.length < 30) {
    throw new Error('Query too short');
  }

  const { data, error } = await supabase.functions.invoke('generate-recipe', {
    body: JSON.stringify({ query }),
  });

  if (error) {
    console.log('Error generating recipe', error);
    throw new Error('Error generating recipe');
  }

  if (!data) {
    throw new Error('Error generating recipe');
  }

  return {
    ...data,
    performTime: convertTimeToString(data.performTime),
    prepTime: convertTimeToString(data.prepTime),
    recipeIngredient: convertRecipeIngredientInstructions(data.recipeIngredients),
    recipeInstructions: convertRecipeIngredientInstructions(data.recipeInstructions),
  };
};
