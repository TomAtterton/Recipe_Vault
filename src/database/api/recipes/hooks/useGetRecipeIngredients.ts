import { useMemo } from 'react';
import useDatabaseQuery from '@/database/hooks/useDatabaseQuery';
import { SELECT_RECIPE_INGREDIENTS } from '@/database/api/recipes';

const useGetRecipeIngredients = (recipeId?: string | null) => {
  const { data } = useDatabaseQuery(SELECT_RECIPE_INGREDIENTS, [recipeId]);
  const ingredients = useMemo(() => {
    if (data) {
      return data.map((ingredient) => {
        return {
          id: ingredient.id,
          text: ingredient.text,
          isEditing: false,
          title: ingredient.section_title,
        };
      });
    }
    return [];
  }, [data]);

  return { ingredients };
};

export default useGetRecipeIngredients;
