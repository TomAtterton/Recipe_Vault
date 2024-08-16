import { Routes } from '@/navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import { RecipeDetailType } from '@/types';
import usePostUpdateRecipes from '@/database/api/recipes/hooks/usePostUpdateRecipes';
import { showSuccessMessage } from '@/utils/promptUtils';
import { useEffect, useState } from 'react';

const useAddRecipe = ({
  data,
  hasScanContent,
}: {
  data?: Partial<RecipeDetailType>;
  hasScanContent: boolean;
}) => {
  const { onSubmit } = usePostUpdateRecipes();

  const navigation = useNavigation();

  const [currentData, setCurrentData] = useState<Partial<RecipeDetailType> | undefined>(data);

  useEffect(() => {
    if (!hasScanContent) {
      setCurrentData(data);
    }
  }, [data, hasScanContent]);

  const onAddRecipe = async ({ updateValues }: { updateValues: Partial<RecipeDetailType> }) => {
    try {
      const recipeId = await onSubmit(updateValues);

      showSuccessMessage('Recipe added successfully');

      setCurrentData(undefined);

      navigation.navigate(Routes.Home);

      if (recipeId) {
        navigation.navigate(Routes.RecipeDetailStack, {
          screen: Routes.RecipeDetails,
          params: {
            id: recipeId,
            image: updateValues?.image || null,
          },
        });
      }
    } catch (e) {
      throw e;
    }
  };
  return {
    onAddRecipe,
    currentData,
  };
};

export default useAddRecipe;
