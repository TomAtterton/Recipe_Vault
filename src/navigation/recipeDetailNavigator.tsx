import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import EditRecipe from 'src/screens/EditRecipe';
import RecipeDetail from 'src/screens/RecipeDetail';
import { Routes } from '@/navigation/Routes';
import { RecipeDetailType } from '@/types';
import { RecipeFormType } from '@/utils/recipeFormUtil';
import RecipeTextInputContainer from 'src/screens/RecipeTextInputContainer';

export type RecipeDetailStackParamList = {
  [Routes.RecipeDetails]: { id: string; image: string | null; servings: number };
  [Routes.EditRecipe]: {
    id?: string | null;
    data?: RecipeDetailType;
  };
  [Routes.RecipeTextInputContainer]: {
    id?: string | null;
    value: string;
    formId: keyof RecipeFormType;
    isEditing?: boolean;
  };
};

const Stack = createNativeStackNavigator<RecipeDetailStackParamList>();

export const RecipeDetailNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.RecipeDetails}
        component={RecipeDetail}
        options={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        name={Routes.EditRecipe}
        component={EditRecipe}
        options={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        name={Routes.RecipeTextInputContainer}
        component={RecipeTextInputContainer}
        options={{
          headerShown: false,
          presentation: 'containedModal',
        }}
      />
    </Stack.Navigator>
  );
};
