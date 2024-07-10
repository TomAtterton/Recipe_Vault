import { useRoute } from '@react-navigation/native';
import { useKeepAwake } from 'expo-keep-awake';
import React, { useCallback } from 'react';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';

import type { RouteProp } from '@/navigation/types';
import RecipeHeader from '@/screens/RecipeDetail/components/RecipeHeader';
import Ingredients from '@/screens/RecipeDetail/components/Ingredients';
import Instructions from '@/screens/RecipeDetail/components/Instructions';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useSyncOnFocus from '@/database/hooks/useSyncOnFocus';
import { useStyles } from 'react-native-unistyles';
import useGetRecipeIngredients from '@/database/api/recipes/hooks/useGetRecipeIngredients';
import { RECIPE_HEADER_HEIGHT } from '@/screens/RecipeDetail/components/RecipeHeader/RecipeHeader';

const RecipeDetail = () => {
  useKeepAwake();
  const { params } = useRoute<RouteProp<'RecipeDetails'>>();

  const handleRenderHeader = useCallback(() => <RecipeHeader recipeId={params.id} />, [params.id]);

  const { theme } = useStyles();
  const { top } = useSafeAreaInsets();

  useSyncOnFocus();

  const { ingredients: data } = useGetRecipeIngredients(params.id);

  return (
    <Tabs.Container
      headerHeight={RECIPE_HEADER_HEIGHT}
      lazy
      minHeaderHeight={top}
      allowHeaderOverscroll
      renderTabBar={(props) => (
        <MaterialTabBar
          labelStyle={{
            ...theme.fonts.titleMedium,
          }}
          indicatorStyle={{
            backgroundColor: theme.colors.primary,
          }}
          {...props}
          activeColor={theme.colors.onBackground}
          inactiveColor={theme.colors.onBackground}
        />
      )}
      headerContainerStyle={{
        backgroundColor: theme.colors.background,
      }}
      renderHeader={handleRenderHeader}
    >
      <Tabs.Tab name="Ingredients" label={'Ingredients'} key={'ingredients'}>
        <Ingredients recipeId={params.id} data={data} />
      </Tabs.Tab>
      <Tabs.Tab name="Instructions" label={'Instructions'} key={'instructions'}>
        <Instructions recipeId={params.id} ingredients={data} />
      </Tabs.Tab>
    </Tabs.Container>
  );
};

export default RecipeDetail;
