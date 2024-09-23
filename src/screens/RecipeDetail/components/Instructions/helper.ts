import { Ingredient } from '@/types';
import { formatIngredient, RecipeUnit } from '@/services/parser/ingredients/ingredientParser';

export const ingredientDescription = (
  ingredientKeyword: string,
  ingredients: Ingredient[],
  initialServings: number,
  servings?: number,
  recipeUnit?: RecipeUnit,
): string | undefined => {
  const lowerCaseKeyword = ingredientKeyword.toLowerCase();
  const ingredient = ingredients.find(({ text }) => text.toLowerCase().includes(lowerCaseKeyword));

  if (!ingredient || !ingredient.text) {
    return undefined;
  }

  return formatIngredient(ingredient.text, initialServings, servings, recipeUnit);
};
