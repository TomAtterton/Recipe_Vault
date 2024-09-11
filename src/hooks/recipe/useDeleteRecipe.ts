import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import useDeleteRecipeApi from '@/database/api/recipes/hooks/useDeleteRecipeSupabase';
import { showErrorMessage, showSuccessMessage } from '@/utils/promptUtils';
import { deleteImage } from '@/services/image';
import { syncWithSupabase } from '@/services/sync';
import { Routes } from '@/navigation/Routes';
import { translate } from '@/core';

const useDeleteRecipe = () => {
  const { deleteRecipe } = useDeleteRecipeApi();
  const [isDeleting, setDeleting] = useState(false);

  const navigation = useNavigation();

  const onDeleteRecipe = async ({
    id,
    previousImage,
  }: {
    id?: string | null;
    previousImage: string;
  }) => {
    try {
      setDeleting(true);

      // Perform the actual deletion
      !!id && deleteImage(id, previousImage);
      !!id && (await deleteRecipe({ id }));
      navigation.navigate(Routes.Home);
      syncWithSupabase();

      // Show success message
      showSuccessMessage(translate('delete_recipe.success_message'));
    } catch (error) {
      console.log('error', error);
      // Show error message
      showErrorMessage(translate('delete_recipe.error_message'));
    } finally {
      setDeleting(false);
    }
  };

  return { onDeleteRecipe, isDeleting };
};

export default useDeleteRecipe;
