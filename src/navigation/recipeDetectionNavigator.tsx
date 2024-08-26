import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { Routes } from '@/navigation/Routes';
import { RecipeDetailType } from '@/types';
import AddRecipe from '@/screens/AddRecipe';
import ImageDetection from '@/screens/ImageDetection';

export type RecipeDetectionStackParamList = {
  [Routes.AddRecipe]: {
    type?: string;
    id?: string | null;
    isNested?: boolean;
    data?: RecipeDetailType;
  };
  [Routes.ImageDetection]: undefined;
};

const Stack = createNativeStackNavigator<RecipeDetectionStackParamList>();

export const RecipeDetectionNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.AddRecipe}
        component={AddRecipe}
        options={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        name={Routes.ImageDetection}
        component={ImageDetection}
        options={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
    </Stack.Navigator>
  );
};
