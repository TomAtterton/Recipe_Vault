import type { NavigatorScreenParams, RouteProp as NRouteProp } from '@react-navigation/native';

import { RecipeDetailStackParamList } from '@/navigation/recipeDetailNavigator';
import { TabParamList } from '@/navigation/tabNavigator';
import { Routes } from '@/navigation/Routes';
import { RecipeFormType } from '@/utils/recipeFormUtil';

export type RootStackParamList = RecipeDetailStackParamList &
  TabParamList & {
    [Routes.TabStack]: undefined;
    [Routes.Splashscreen]: undefined;
    [Routes.Login]: {
      showSkip: boolean;
    };
    [Routes.ProPlan]: undefined;
    [Routes.Privacy]: undefined;
    [Routes.Help]: undefined;
    [Routes.Onboarding]: undefined;
    [Routes.DatabaseSettings]: undefined;
    [Routes.AppSettings]: undefined;
    [Routes.SyncSettings]: undefined;
    [Routes.AdvanceSyncSettings]: undefined;
    [Routes.DatabaseEditor]: undefined;
    [Routes.AddGroceries]: {
      ingredients?: string[];
    };
    [Routes.Profile]: undefined;
    [Routes.Search]: {
      entryType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      selectDate: string;
    };
    [Routes.RecipeDetailStack]: NavigatorScreenParams<RecipeDetailStackParamList>;
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
