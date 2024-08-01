import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import debounce from 'lodash.debounce';

import Image from '@/components/Image';
import { RecipeDetailType } from '@/types';
import RecipeDescription from '@/screens/RecipeDetail/components/RecipeHeader/components/RecipeDescription';
import useRecipeDetail from '@/hooks/recipe/useRecipeDetail';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './recipeHeader.style';

const RecipeHeader = ({ recipeId, image }: { recipeId: string; image: string | null }) => {
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
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: image,
        }}
      />
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
    </View>
  );
};

export default RecipeHeader;
