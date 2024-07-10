import React from 'react';

import useDeleteRecipe from '@/hooks/recipe/useDeleteRecipe';
import { useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { RouteProp } from '@/navigation/types';
import useEditRecipe from '@/hooks/recipe/useEditRecipe';
import RecipeForm from '@/components/RecipeForm';

const EditRecipe = ({}) => {
  const {
    params: { id, scanContent },
  } = useRoute<RouteProp<Routes.EditRecipe>>();

  const { data, onUpdateRecipe } = useEditRecipe({ id });

  const { onDeleteRecipe } = useDeleteRecipe();

  const handleDeleteRecipe = () => onDeleteRecipe(id);

  return (
    <RecipeForm
      id={id}
      buttonTitle="Update recipe"
      scanContent={scanContent}
      onSubmitForm={onUpdateRecipe}
      data={data}
      isEditing={true}
      onDeleteRecipe={handleDeleteRecipe}
    />
  );
};

export default EditRecipe;
