import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import EditRecipe from 'src/screens/EditRecipe';
import RecipeDetail from 'src/screens/RecipeDetail';
import { Routes } from '@/navigation/Routes';
import { RecipeDetailType } from '@/types';
import { RecipeFormType } from '@/utils/recipeFormUtil';
import { ScanImageDataType } from '@/screens/ScanImageContent/scanImageUtil';
import ScanImageContent from '@/screens/ScanImageContent';

export type RecipeDetailStackParamList = {
  RecipeDetails: { id: string; image: string | null };
  EditRecipe: {
    id?: string | null;
    scanContent?: {
      data: {
        [key: string]: ScanImageDataType;
      };
    };
    data?: Partial<RecipeDetailType>;
  };
  [Routes.ScanImageContent]: {
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
        name={Routes.ScanImageContent}
        component={ScanImageContent}
        options={{
          headerShown: false,
          presentation: 'containedModal',
        }}
      />
    </Stack.Navigator>
  );
};
