import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { Routes } from '@/navigation/Routes';
import { RecipeDetailType } from '@/types';
import usePostUpdateRecipes from '@/database/api/recipes/hooks/usePostUpdateRecipes';
import { showErrorMessage, showSuccessMessage } from '@/utils/promptUtils';
import useGetRecipeDetailsCombined from '@/database/api/recipes/hooks/useGetRecipeDetailsCombined';

const useEditRecipe = ({ id }: { id?: string | null }) => {
  const navigation = useNavigation();
  const { data: recipeData } = useGetRecipeDetailsCombined({ id });

  const { onSubmit } = usePostUpdateRecipes();

  const onUpdateRecipe = useCallback(
    async ({
      updateValues,
      showBanner,
      shouldNavigate = true,
    }: {
      updateValues: Partial<RecipeDetailType>;
      showBanner?: boolean;
      shouldNavigate?: boolean;
    }) => {
      try {
        const filteredData = Object.fromEntries(
          Object.entries(recipeData || []).filter(([key]) => !(key in updateValues))
        );

        console.log('filteredData', filteredData, recipeData);

        const mergedData = {
          ...filteredData,
          ...updateValues,
        };
        console.log('mergedData', mergedData);

        await onSubmit(mergedData, id, recipeData);

        if (showBanner) {
          showSuccessMessage('Recipe updated successfully');
        }
        if (shouldNavigate) {
          navigation.navigate(Routes.Home);
          id &&
            navigation.navigate(Routes.RecipeDetailStack, {
              screen: Routes.RecipeDetails,
              params: {
                id,
              },
            });
        }
      } catch (e) {
        showErrorMessage('Error updating recipe');
      }
    },
    [id, navigation, onSubmit, recipeData]
  );

  return {
    onUpdateRecipe,
    data: recipeData,
  };
};

export default useEditRecipe;
