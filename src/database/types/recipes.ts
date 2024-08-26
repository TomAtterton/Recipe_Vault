import { Tables } from '@/database/types/database-generated.types';

export type TRecipeDatabase = Tables<'recipes'>;
export type TRecipeIngredientsDatabase = Tables<'recipe_ingredients'>;
export type TRecipeInstructionsDatabase = Tables<'recipe_instructions'>;
export type TRecipeTagsDatabase = Tables<'recipe_tags'>;
export type TRecipeCategoriesDatabase = Tables<'recipe_categories'>;

export type TRecipeDetailsDatabase = TRecipeDatabase & {
  recipe_ingredients: TRecipeIngredientsDatabase[];
  recipe_instructions: TRecipeInstructionsDatabase[];
  recipe_tags: TRecipeTagsDatabase[];
  recipe_categories: TRecipeCategoriesDatabase[];
};

export type TCategoriesDatabase = Tables<'categories'>[];
export type TTagsDatabase = Tables<'tags'>[];
