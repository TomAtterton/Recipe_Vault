import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { Routes } from '@/navigation/Routes';
import { RecipeDetailType } from '@/types';
import useGetRecipeDetails from '@/database/api/recipes/hooks/useGetRecipeDetails';
import usePostUpdateRecipes from '@/database/api/recipes/hooks/usePostUpdateRecipes';
import { showErrorMessage, showSuccessMessage } from '@/utils/promptUtils';

const useRecipeDetail = ({ id }: { id?: string | null }) => {
  const navigation = useNavigation();
  const { data: recipeData } = useGetRecipeDetails({ id });

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

        const mergedData = {
          ...filteredData,
          ...updateValues,
        };

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
                image: mergedData?.image || null,
                servings: mergedData?.servings || 1,
              },
            });
        }
      } catch (e) {
        console.log('error', e);
        if (showBanner) {
          showErrorMessage('Error updating recipe');
        }
      }
    },
    [id, navigation, onSubmit, recipeData]
  );

  return {
    onUpdateRecipe,
    data: recipeData,
  };
};

export default useRecipeDetail;
