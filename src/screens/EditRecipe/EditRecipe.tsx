import React from 'react';

import useDeleteRecipe from '@/hooks/recipe/useDeleteRecipe';
import { useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { RouteProp } from '@/navigation/types';
import RecipeForm from '@/components/RecipeForm';
import useRecipeDetail from '@/hooks/recipe/useRecipeDetail';
import { ActivityIndicator } from 'react-native';
import { useStyles } from 'react-native-unistyles';

const EditRecipe = ({}) => {
  const {
    params: { id },
  } = useRoute<RouteProp<Routes.EditRecipe>>();

  const {
    theme: { colors },
  } = useStyles();

  const { data, onUpdateRecipe } = useRecipeDetail({ id });

  const { onDeleteRecipe } = useDeleteRecipe();

  const handleDeleteRecipe = () => onDeleteRecipe({ id, previousImage: data?.image || '' });

  return data ? (
    <RecipeForm
      id={id}
      buttonTitle="Update recipe"
      onSubmitForm={onUpdateRecipe}
      data={data}
      isEditing={true}
      isNested={true}
      onDeleteRecipe={handleDeleteRecipe}
    />
  ) : (
    <ActivityIndicator
      size="large"
      color={colors.primary}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};
export default EditRecipe;
