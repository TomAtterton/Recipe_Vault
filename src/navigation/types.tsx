import type { NavigatorScreenParams, RouteProp as NRouteProp } from '@react-navigation/native';

import { RecipeDetailStackParamList } from '@/navigation/recipeDetailNavigator';
import { TabParamList } from '@/navigation/tabNavigator';
import { Routes } from '@/navigation/Routes';
import { RecipeFormType } from '@/utils/recipeFormUtil';
import { Ingredient } from '@/types';
import { RecipeDetectionStackParamList } from '@/navigation/recipeDetectionNavigator';

export type RootStackParamList = RecipeDetailStackParamList &
  TabParamList & {
    [Routes.TabStack]: undefined;
    [Routes.Splashscreen]: undefined;
    [Routes.Settings]: undefined;
    [Routes.Login]: {
      showSkip: boolean;
    };
    [Routes.ProPlan]: undefined;
    [Routes.ImageDetection]: undefined;
    [Routes.Privacy]: undefined;
    [Routes.Help]: undefined;
    [Routes.Onboarding]: undefined;
    [Routes.DatabaseSettings]: undefined;
    [Routes.AccountSettings]: undefined;
    [Routes.AppSettings]: undefined;
    [Routes.RecipeSettings]: undefined;
    [Routes.SyncSettings]: undefined;
    [Routes.AdvanceSyncSettings]: undefined;
    [Routes.DatabaseEditor]: undefined;
    [Routes.CreateVault]: undefined;
    [Routes.JoinVault]: undefined;
    [Routes.ManageGroupUsers]: undefined;
    [Routes.AddGroceries]: {
      ingredients?: Ingredient[];
    };
    [Routes.Profile]: undefined;
    [Routes.WelcomeOnboarding]: undefined;
    [Routes.Search]: {
      entryType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      selectDate: string;
    };
    [Routes.RecipeDetailStack]: NavigatorScreenParams<RecipeDetailStackParamList>;
    [Routes.RecipeDetectionStack]: NavigatorScreenParams<RecipeDetectionStackParamList>;
    [Routes.ScanImageContent]: {
      id?: string | null;
      value: string;
      formId?: keyof RecipeFormType;
      isEditing?: boolean;
    };
  };

// very important to type check useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RouteProp<T extends keyof RootStackParamList> = NRouteProp<RootStackParamList, T>;
