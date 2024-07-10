import { useMemo } from 'react';
import { RecipeDetailType } from '@/types';
import useDatabaseQuery from '@/database/hooks/useDatabaseQuery';
import { SELECT_RECIPE_DETAILS, SELECT_RECIPE_INGREDIENTS } from '@/database/api/recipes';

const useGetRecipeDetails = ({ id }: { id?: string | null }) => {
  const { data: recipeIngredients } = useDatabaseQuery(SELECT_RECIPE_INGREDIENTS, [id || '']);
  const { data: recipeData } = useDatabaseQuery(SELECT_RECIPE_DETAILS, [id || '']);

  const transformedData = useMemo(() => {
    const data = recipeData?.[0] || {};
    return data && transformData(data);
  }, [recipeData]);

  return {
    data: {
      ...transformedData,
      ingredients: recipeIngredients,
    } as RecipeDetailType,
  };
};
export const transformData = (recipe: {
  id: string;
  name: string;
  user_id: string;
  description: string;
  rating: number | null;
  date_added: string | null;
  created_at: string | null;
  image: string | null;
  note: string | null;
  last_made: string | null;
  source: string | null;
  cook_time: string | null;
  prep_time: string | null;
  servings: number | null;
}) => ({
  id: recipe.id,
  userId: recipe.user_id,
  name: recipe.name,
  description: recipe.description,
  rating: recipe.rating,
  dateAdded: recipe.date_added,
  dateUpdated: recipe.created_at,
  image: recipe.image,
  note: recipe.note,
  lastMade: recipe.last_made,
  source: recipe.source,
  performTime: recipe.cook_time,
  prepTime: recipe.prep_time,
  servings: recipe.servings,
});

export default useGetRecipeDetails;
