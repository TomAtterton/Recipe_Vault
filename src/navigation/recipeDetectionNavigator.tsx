import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { Routes } from '@/navigation/Routes';
import { RecipeDetailType } from '@/types';
import AddRecipe from '@/screens/AddRecipe';
import ImageDetection from '@/screens/ImageDetection';
import ImageTextSelection from '@/components/ImageTextSelection';
import { Block } from '@/components/ImageTextSelection/types';
import type { RouteProp as NRouteProp } from '@react-navigation/core/lib/typescript/src/types';

export type RecipeDetectionStackParamList = {
  [Routes.AddRecipe]: {
    type?: string;
    id?: string | null;
    isNested?: boolean;
    data?: RecipeDetailType;
  };
  [Routes.ImageDetection]: undefined;
  [Routes.ImageTextSelection]: {
    imageUri: string;
    blocks: Block[];
  };
};

export type RecipeDetectionRouteProp<T extends keyof RecipeDetectionStackParamList> = NRouteProp<
  RecipeDetectionStackParamList,
  T
>;

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
      <Stack.Screen
        name={Routes.ImageTextSelection}
        component={ImageTextSelection}
        options={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
    </Stack.Navigator>
  );
};
