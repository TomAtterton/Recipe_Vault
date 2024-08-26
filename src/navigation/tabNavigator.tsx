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
import { useCallback } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs/src/types';

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
    data?: RecipeDetailType;
  };
  [Routes.RecipeWebview]: undefined;
  [Routes.Groceries]: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const screenOptions = {
  headerShown: false,
};

export const TabNavigator = () => {
  const renderTabBar = useCallback((props: BottomTabBarProps) => {
    return <TabBar {...props} />;
  }, []);
  return (
    <Tab.Navigator tabBar={renderTabBar} screenOptions={screenOptions}>
      <Tab.Screen key={Routes.Home} name={Routes.Home} component={Home} />
      <Tab.Screen
        key={Routes.RecipeWebview}
        name={Routes.RecipeWebview}
        component={RecipeWebview}
      />
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
};
