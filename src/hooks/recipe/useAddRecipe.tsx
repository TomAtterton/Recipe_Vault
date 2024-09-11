import { Routes } from '@/navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import { RecipeDetailType } from '@/types';
import usePostUpdateRecipes from '@/database/api/recipes/hooks/usePostUpdateRecipes';
import { showSuccessMessage } from '@/utils/promptUtils';
import { translate } from '@/core';

const useAddRecipe = () => {
  const { onSubmit } = usePostUpdateRecipes();
  const navigation = useNavigation();

  const onAddRecipe = async ({ updateValues }: { updateValues: RecipeDetailType }) => {
    try {
      const recipeId = await onSubmit(updateValues);

      showSuccessMessage(translate('recipe.add_success')); // Localized success message

      navigation.navigate(Routes.Home);

      if (recipeId) {
        navigation.navigate(Routes.RecipeDetailStack, {
          screen: Routes.RecipeDetails,
          params: {
            id: recipeId,
            image: updateValues?.image || null,
            servings: updateValues?.servings || 1,
          },
        });
      }
    } catch (e) {
      throw e;
    }
  };

  return {
    onAddRecipe,
  };
};

export default useAddRecipe;
