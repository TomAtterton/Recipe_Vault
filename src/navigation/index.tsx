import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { TabNavigator } from './tabNavigator';

import { RecipeDetailNavigator } from '@/navigation/recipeDetailNavigator';
import { Routes } from '@/navigation/Routes';
import Settings from '@/screens/Settings';
import useHandleShare from '@/hooks/common/useHandleShare';
import Login from '@/screens/Login';
import Splashscreen from '@/screens/Splashscreen';
import Search from '@/screens/Search';
import Profile from '@/screens/Profile';
import AddGroceries from '@/screens/AddGroceries';
import ScanImageContent from '@/screens/ScanImageContent';
import DatabaseSettings from '@/screens/Settings/pages/DatabaseSettings';
import Onboarding from '@/screens/Onboarding';
import SyncSettings from '@/screens/Settings/pages/SyncSettings';
import AppSettings from '@/screens/Settings/pages/AppSettings';
import Privacy from '@/screens/Privacy';
import Help from '@/screens/Help';
import DatabaseEditor from '@/screens/Settings/pages/DatabaseSettings/DatabaseEditor';
import AdvanceSyncSettings from '@/screens/Settings/pages/AdvanceSyncSettings';
import ProPlan from '@/screens/ProPlan';
import { RecipeDetectionNavigator } from '@/navigation/recipeDetectionNavigator';
import RecipeSettings from '@/screens/Settings/pages/RecipeSettings';
import CreateVault from '@/screens/CreateVault';
import JoinVault from '@/screens/JoinVault';
import AccountSettings from '@/screens/Settings/pages/AccountSettings';
import ManageGroupUsers from '@/screens/Settings/pages/ManageGroupUsers';
import WelcomeOnboarding from '@/screens/WelcomeOnboarding';

const Stack = createNativeStackNavigator();

const defaultOptions = {
  headerShown: false,
};

export const RootNavigator = () => {
  useHandleShare();
  return (
    <Stack.Navigator initialRouteName={Routes.Splashscreen} screenOptions={defaultOptions}>
      <Stack.Screen name={Routes.Splashscreen} component={Splashscreen} options={defaultOptions} />
      <Stack.Screen name={Routes.Onboarding} component={Onboarding} options={defaultOptions} />
      <Stack.Screen name={Routes.Login} component={Login} options={defaultOptions} />
      <Stack.Screen name={Routes.Profile} component={Profile} options={defaultOptions} />
      <Stack.Screen
        name={Routes.WelcomeOnboarding}
        component={WelcomeOnboarding}
        options={defaultOptions}
      />
      <Stack.Screen name={Routes.TabStack} component={TabNavigator} />
      <Stack.Screen name={Routes.RecipeDetailStack} component={RecipeDetailNavigator} />
      <Stack.Screen name={Routes.RecipeDetectionStack} component={RecipeDetectionNavigator} />
      <Stack.Screen name={Routes.DatabaseEditor} component={DatabaseEditor} />
      <Stack.Screen name={Routes.AdvanceSyncSettings} component={AdvanceSyncSettings} />

      <Stack.Screen
        name={Routes.ProPlan}
        component={ProPlan}
        options={{
          headerShown: false,
          presentation: 'modal',
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        name={Routes.AddGroceries}
        component={AddGroceries}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name={Routes.Search}
        component={Search}
        options={{
          headerShown: false,
          presentation: 'modal',
          navigationBarHidden: true,
        }}
      />

      <Stack.Screen
        key={Routes.Settings}
        name={Routes.Settings}
        component={Settings}
        options={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        key={Routes.AppSettings}
        name={Routes.AppSettings}
        component={AppSettings}
        options={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        key={Routes.RecipeSettings}
        name={Routes.RecipeSettings}
        component={RecipeSettings}
        options={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        key={Routes.CreateVault}
        name={Routes.CreateVault}
        component={CreateVault}
        options={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        key={Routes.JoinVault}
        name={Routes.JoinVault}
        component={JoinVault}
        options={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        key={Routes.DatabaseSettings}
        name={Routes.DatabaseSettings}
        component={DatabaseSettings}
        options={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        key={Routes.AccountSettings}
        name={Routes.AccountSettings}
        component={AccountSettings}
        options={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        key={Routes.ManageGroupUsers}
        name={Routes.ManageGroupUsers}
        component={ManageGroupUsers}
        options={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        key={Routes.SyncSettings}
        name={Routes.SyncSettings}
        component={SyncSettings}
        options={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        key={Routes.Privacy}
        name={Routes.Privacy}
        component={Privacy}
        options={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        key={Routes.Help}
        name={Routes.Help}
        component={Help}
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
