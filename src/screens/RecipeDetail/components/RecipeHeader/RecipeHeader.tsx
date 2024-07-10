import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import debounce from 'lodash.debounce';

import Image from '@/components/Image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RecipeDetailType } from '@/types';
import EditButton from '@/screens/RecipeDetail/components/RecipeHeader/components/EditButton';
import RecipeDescription from '@/screens/RecipeDetail/components/RecipeHeader/components/RecipeDescription';
import useRecipeDetail from '@/hooks/recipe/useRecipeDetail';
import { useStyles } from 'react-native-unistyles';
import { IMAGE_HEIGHT, stylesheet } from './recipeHeader.style';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import metrics from '@/theme/metrics';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useCurrentTabScrollY } from 'react-native-collapsible-tab-view';

export const RECIPE_HEADER_HEIGHT = IMAGE_HEIGHT + metrics.screenHeight / 4;

const RecipeHeader = ({ recipeId }: { recipeId: string }) => {
  const { data, onUpdateRecipe } = useRecipeDetail({
    id: recipeId,
  });

  const { styles } = useStyles(stylesheet);

  const handleUpdateRecipe = useCallback(
    (updateValues?: Partial<RecipeDetailType>) => {
      return updateValues && onUpdateRecipe({ updateValues, shouldNavigate: false });
    },
    [onUpdateRecipe]
  );
  const {
    name,
    id,
    image,
    prepTime,
    performTime: cookTime,
    rating: currentRating,
    source,
    note,
    // @ts-ignore
    ingredients,
  } = data || {};

  const debouncedUpdateRecipe = useMemo(() => {
    return handleUpdateRecipe && debounce(handleUpdateRecipe, 500);
  }, [handleUpdateRecipe]);

  const onRatingChange = useCallback(
    (value: number) => {
      debouncedUpdateRecipe?.({ rating: value });
    },
    [debouncedUpdateRecipe]
  );

  const scrollY = useCurrentTabScrollY();

  const animatedStyle = useAnimatedStyle(() => {
    const interpolatedOpacity = interpolate(scrollY.value, [0, RECIPE_HEADER_HEIGHT / 1.5], [1, 0]);
    return {
      opacity: interpolatedOpacity,
      minHeight: RECIPE_HEADER_HEIGHT,
      maxHeight: RECIPE_HEADER_HEIGHT,
    };
  });

  const animatedImageScaleStyle = useAnimatedStyle(() => {
    const interpolatedScale = interpolate(
      scrollY.value,
      [-RECIPE_HEADER_HEIGHT, 0, RECIPE_HEADER_HEIGHT],
      [1.5, 1, 1]
    );
    const translateY = interpolate(
      scrollY.value,
      [-RECIPE_HEADER_HEIGHT, 0, RECIPE_HEADER_HEIGHT],
      [-RECIPE_HEADER_HEIGHT, 0, 0]
    );

    return {
      transform: [{ scale: interpolatedScale }, { translateY }],
      position: 'absolute',
      top: 0, // Adjust this value to position the scaled image correctly
      left: 0, // Adjust this value to position the scaled image correctly
    };
  });
  const { goBack } = useNavigation();
  const { top } = useSafeAreaInsets();

  const animatedNavBarStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-RECIPE_HEADER_HEIGHT, 0, RECIPE_HEADER_HEIGHT],
      [-RECIPE_HEADER_HEIGHT, 0, 0]
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View pointerEvents={'box-none'} style={animatedStyle}>
      <View pointerEvents={'box-none'}>
        <Image
          pointerEvents={'none'}
          style={[styles.image, animatedImageScaleStyle]}
          source={{
            uri: image,
          }}
        />
        <Animated.View
          pointerEvents={'box-none'}
          style={[styles.topNavigation, { top }, animatedNavBarStyle]}
        >
          <NavBarButton iconSource={'arrow-left'} onPress={goBack} />
          <EditButton id={recipeId} />
        </Animated.View>
      </View>
      <RecipeDescription
        id={id}
        prepTime={prepTime}
        cookTime={cookTime}
        name={name}
        source={source}
        note={note}
        onRatingChange={onRatingChange}
        currentRating={currentRating || 0}
        ingredients={ingredients}
      />
    </Animated.View>
  );
};

export default RecipeHeader;
