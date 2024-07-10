import { useMemo } from 'react';
import useDatabaseQuery from '@/database/hooks/useDatabaseQuery';
import { SELECT_RECIPE_INSTRUCTIONS } from '@/database/api/recipes';

const useGetRecipeInstructions = (recipeId: string) => {
  const { data } = useDatabaseQuery(SELECT_RECIPE_INSTRUCTIONS, [recipeId || '']);
  const instructions = useMemo(() => {
    if (data) {
      return data.map((instruction) => {
        return {
          id: instruction.id,
          text: instruction.text,
          isEditing: false,
          title: instruction.section_title,
        };
      });
    }
    return [];
  }, [data]);

  return { instructions };
};

export default useGetRecipeInstructions;
