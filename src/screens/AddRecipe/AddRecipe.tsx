import React from 'react';

import useAddRecipe from '@/hooks/recipe/useAddRecipe';
import { useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { RouteProp } from '@/navigation/types';
import RecipeForm from '@/components/RecipeForm';

const AddRecipe = ({}) => {
  const { params } = useRoute<RouteProp<Routes.AddRecipe>>();
  const { id, scanContent, data } = params || {};
  const hasScanContent = !!scanContent;
  const { onAddRecipe, currentData } = useAddRecipe({ data, hasScanContent });

  return (
    <RecipeForm
      id={id}
      buttonTitle="Add recipe"
      scanContent={scanContent}
      onSubmitForm={onAddRecipe}
      data={currentData}
    />
  );
};

export default AddRecipe;
