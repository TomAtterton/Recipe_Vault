import { useNavigation, useRoute } from '@react-navigation/native';
import { useKeepAwake } from 'expo-keep-awake';
import React, { useCallback, useMemo } from 'react';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';

import type { RouteProp } from '@/navigation/types';
import { RecipeHeader, AnimatedRecipeHeader } from '@/screens/RecipeDetail/components/RecipeHeader';
import Ingredients from '@/screens/RecipeDetail/components/Ingredients';
import Instructions from '@/screens/RecipeDetail/components/Instructions';
import EditButton from './components/RecipeHeader/components/EditButton';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useSyncOnFocus from '@/database/hooks/useSyncOnFocus';
import { useStyles } from 'react-native-unistyles';
import useGetRecipeIngredients from '@/database/api/recipes/hooks/useGetRecipeIngredients';
import { useWindowDimensions, View } from 'react-native';
import NavBarButton from '@/components/buttons/NavBarButton';
import { stylesheet } from './recipeDetail.style';

const RecipeDetail = () => {
  useKeepAwake();
  const {
    params: { id, image },
  } = useRoute<RouteProp<'RecipeDetails'>>();

  const { height } = useWindowDimensions();

  const RECIPE_HEADER_HEIGHT = useMemo(() => height / 2.8 + height / 4, [height]);

  const handleRenderHeader = useCallback(
    () => <AnimatedRecipeHeader recipeId={id} image={image} />,
    [id, image]
  );

  const { top } = useSafeAreaInsets();
  const { styles, theme, breakpoint } = useStyles(stylesheet);

  useSyncOnFocus();

  const { ingredients: data } = useGetRecipeIngredients(id);

  const isiPadLandscape = breakpoint === 'xl' || breakpoint === 'lg';
  const isiPadPortrait = breakpoint === 'md';

  const { goBack } = useNavigation();

  return isiPadLandscape || isiPadPortrait ? (
    <View style={styles.container}>
      <RecipeHeader recipeId={id} image={image} />
      <Ingredients recipeId={id} data={data} />
      <Instructions recipeId={id} ingredients={data} />
      <View pointerEvents={'box-none'} style={styles.navBar}>
        <NavBarButton iconSource={'arrow-left'} onPress={goBack} />
        <EditButton id={id} />
      </View>
    </View>
  ) : (
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
        <Ingredients recipeId={id} data={data} />
      </Tabs.Tab>
      <Tabs.Tab name="Instructions" label={'Instructions'} key={'instructions'}>
        <Instructions recipeId={id} ingredients={data} />
      </Tabs.Tab>
    </Tabs.Container>
  );
};

export default RecipeDetail;
