import React from 'react';

import useDeleteRecipe from '@/hooks/recipe/useDeleteRecipe';
import { useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { RouteProp } from '@/navigation/types';
import RecipeForm from '@/components/RecipeForm';
import useRecipeDetail from '@/hooks/recipe/useRecipeDetail';

const EditRecipe = ({}) => {
  const {
    params: { id },
  } = useRoute<RouteProp<Routes.EditRecipe>>();

  const { data, onUpdateRecipe } = useRecipeDetail({ id });
  const { onDeleteRecipe } = useDeleteRecipe();

  const handleDeleteRecipe = () => onDeleteRecipe({ id, previousImage: data?.image || '' });

  return (
    <RecipeForm
      id={id}
      buttonTitle="Update recipe"
      onSubmitForm={onUpdateRecipe}
      data={data}
      isEditing={true}
      isNested={true}
      onDeleteRecipe={handleDeleteRecipe}
    />
  );
};

export default EditRecipe;
