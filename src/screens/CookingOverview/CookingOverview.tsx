import React, { useMemo, useState } from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import useRecipeDetail from '@/hooks/recipe/useRecipeDetail';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@/navigation/types';
import { Routes } from '@/navigation/Routes';
import { useStyles } from 'react-native-unistyles';
import MarkdownText from '@/screens/RecipeDetail/components/Instructions/MarkdownText';
import CloseButton from '@/components/CloseButton';
import { Instruction } from '@/types';
import { styleSheet } from '@/screens/CookingOverview/cookingOverview.style';
import IngredientBottomSheet from '@/screens/CookingOverview/components/IngredientBottomSheet';
import { flattenSanitizeIngredients } from '@/services/parser/ingredients/ingredientsParser';

const CookingOverview = () => {
  const {
    params: { id, initialServings },
  } = useRoute<RouteProp<Routes.CookingOverview>>();

  const { width } = useWindowDimensions();

  const { data } = useRecipeDetail({
    id,
  });

  const ingredients = useMemo(() => data?.recipeIngredient || [], [data]);
  const instructions = data?.recipeInstructions || [];

  const { styles } = useStyles(styleSheet);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const sanitizedIngredients = useMemo(
    () => flattenSanitizeIngredients(ingredients),
    [ingredients],
  );

  const renderInstruction = ({ item }: { item: Instruction }) => (
    <View style={styles.instructionContainer}>
      <MarkdownText
        text={item?.text}
        sanitizedIngredients={sanitizedIngredients}
        ingredients={ingredients}
        initialServings={initialServings}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <CloseButton />
      <FlatList
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        data={instructions}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderInstruction}
        onScroll={handleScroll}
      />
      <IngredientBottomSheet
        ingredients={ingredients}
        parsedIngredients={sanitizedIngredients}
        currentStep={currentIndex}
        instructions={instructions}
        initialServings={initialServings}
        currentInstruction={instructions?.[currentIndex]?.text || ''}
      />
    </View>
  );
};

export default CookingOverview;
