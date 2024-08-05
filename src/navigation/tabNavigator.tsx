import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import Home from '@/screens/Home';
import { Routes } from '@/navigation/Routes';
import RecipeWebview from '@/screens/RecipeWebview';
import RecipeSchedule from 'src/screens/MealPlan';
import Groceries from 'src/screens/Groceries';
import { TabBar } from '@/navigation/TabBar';
import AddRecipe from '@/screens/AddRecipe';
import { ScanImageDataType } from '@/screens/ScanImageContent/scanImageUtil';
import { RecipeDetailType } from '@/types';

export type TabParamList = {
  [Routes.Home]: undefined;
  [Routes.MealPlan]: undefined;
  [Routes.AddRecipe]: {
    type?: string;
    id?: string | null;
    scanContent?: {
      data: {
        [key: string]: ScanImageDataType;
      };
    };
    isNested?: boolean;
    data?: Partial<RecipeDetailType>;
  };
  [Routes.RecipeWebview]: undefined;
  [Routes.Groceries]: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <TabBar {...props} />}
    screenOptions={() => ({
      headerShown: false,
    })}
  >
    <Tab.Screen key={Routes.Home} name={Routes.Home} component={Home} />
    <Tab.Screen key={Routes.RecipeWebview} name={Routes.RecipeWebview} component={RecipeWebview} />
    <Tab.Screen
      key={Routes.AddRecipe}
      name={Routes.AddRecipe}
      // @ts-ignore
      component={AddRecipe}
    />
    <Tab.Screen key={Routes.MealPlan} name={Routes.MealPlan} component={RecipeSchedule} />
    <Tab.Screen key={Routes.Groceries} name={Routes.Groceries} component={Groceries} />
  </Tab.Navigator>
);
