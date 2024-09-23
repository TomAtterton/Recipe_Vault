import React, { useCallback, useMemo, useState } from 'react';
import { View, useWindowDimensions, ScrollView } from 'react-native';
import useRecipeDetail from '@/hooks/recipe/useRecipeDetail';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@/navigation/types';
import { Routes } from '@/navigation/Routes';
import { useStyles } from 'react-native-unistyles';
import MarkdownText from '@/screens/RecipeDetail/components/Instructions/MarkdownText';
import CloseButton from '@/components/CloseButton';
import { Instruction } from '@/types';
import { styleSheet } from '@/screens/CookingOverview/cookingOverview.style';
import { flattenSanitizeIngredients } from '@/services/parser/ingredients/ingredientsParser';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import IngredientBottomSheet from '@/screens/CookingOverview/components/IngredientBottomSheet';

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

  const renderInstruction = useCallback(
    ({ item }: { item: Instruction }) => (
      <ScrollView contentContainerStyle={styles.instructionScrollContainer}>
        <View style={styles.instructionContainer}>
          <MarkdownText
            text={item?.text}
            sanitizedIngredients={sanitizedIngredients}
            ingredients={ingredients}
            initialServings={initialServings}
          />
        </View>
      </ScrollView>
    ),
    [
      styles.instructionScrollContainer,
      styles.instructionContainer,
      sanitizedIngredients,
      ingredients,
      initialServings,
    ],
  );
  const { height: screenHeight } = useWindowDimensions();

  const MIN_SHEET_HEIGHT = screenHeight * 0.1;

  const sheetHeight = useSharedValue(MIN_SHEET_HEIGHT);

  const animatedContentContainerStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: withTiming(sheetHeight.value, { duration: 300 }),
    };
  });

  return (
    <View style={styles.container}>
      <CloseButton />
      <Animated.FlatList
        keyExtractor={(item) => item.id}
        style={animatedContentContainerStyle}
        data={instructions}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderInstruction}
        onScroll={handleScroll}
      />
      <IngredientBottomSheet
        sheetHeight={sheetHeight}
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
