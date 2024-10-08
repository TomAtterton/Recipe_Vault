import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { Routes } from '@/navigation/Routes';
import { RecipeDetailType } from '@/types';
import usePostUpdateRecipes from '@/database/api/recipes/hooks/usePostUpdateRecipes';
import { showErrorMessage, showSuccessMessage } from '@/utils/promptUtils';
import useGetRecipeDetailsCombined from '@/database/api/recipes/hooks/useGetRecipeDetailsCombined';
import { translate } from '@/core';

const useRecipeDetail = ({ id }: { id?: string | null }) => {
  const navigation = useNavigation();
  const { data: recipeData, isLoading } = useGetRecipeDetailsCombined({ id });
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
          Object.entries(recipeData || []).filter(([key]) => !(key in updateValues)),
        );

        const mergedData = {
          ...filteredData,
          ...updateValues,
        } as RecipeDetailType;

        await onSubmit(mergedData, id, recipeData);

        if (showBanner) {
          showSuccessMessage(translate('recipe_detail.update_success'));
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
        if (showBanner) {
          showErrorMessage(translate('recipe_detail.update_error'));
        }
        console.log('Error updating recipe', e);
      }
    },
    [id, navigation, onSubmit, recipeData],
  );

  return {
    onUpdateRecipe,
    data: recipeData,
    isLoading,
  };
};

export default useRecipeDetail;
