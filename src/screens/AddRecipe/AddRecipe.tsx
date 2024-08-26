import React from 'react';

import useAddRecipe from '@/hooks/recipe/useAddRecipe';
import { useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { RouteProp } from '@/navigation/types';
import RecipeForm from '@/components/RecipeForm';

const AddRecipe = ({}) => {
  const { params } = useRoute<RouteProp<Routes.AddRecipe>>();
  const { id, data, isNested } = params || {};
  const { onAddRecipe } = useAddRecipe();

  return (
    <RecipeForm
      id={id}
      data={data}
      buttonTitle="Add recipe"
      onSubmitForm={onAddRecipe}
      isNested={isNested}
    />
  );
};

export default AddRecipe;
