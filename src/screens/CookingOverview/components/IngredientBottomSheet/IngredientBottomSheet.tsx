import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { FlatList, Pressable, View } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { useStyles } from 'react-native-unistyles';
import CheckBox from '@/components/CheckBox';
import { MenuView } from '@react-native-menu/menu';
import Icon from '@/components/Icon';
import LabelButton from '@/components/buttons/LabelButton';
import { Ingredient, Instruction } from '@/types';
import Typography from '@/components/Typography';
import { translate } from '@/core';
import { styleSheet } from './ingredientBottomSheet.style';
import useIngredientBottomSheetAnimations from './useIngredientBottomSheetAnimations';
import { formatIngredient } from '@/services/parser/ingredients/ingredientParser';
import { filterIngredientsForCurrentStep } from '@/services/parser/ingredients/ingredientsParser';

interface Props {
  ingredients: Ingredient[];
  instructions: Instruction[];
  parsedIngredients: string[];
  initialServings: number;
  currentStep: number;
  currentInstruction: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const keyExtractor = (item: string, index: number) => `${item}-${index}`;

const IngredientBottomSheet = ({
  ingredients,
  parsedIngredients,
  currentStep,
  initialServings,
  instructions,
  currentInstruction,
}: Props) => {
  const { styles, theme } = useStyles(styleSheet);

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [ingredientsFormat, setIngredientsFormat] = useState<'currentStep' | 'all'>('currentStep');

  const scaledIngredients = useMemo(() => {
    return ingredients.map((item) => formatIngredient(item.text, initialServings));
  }, [ingredients, initialServings]);

  const data = useMemo(() => {
    if (ingredientsFormat === 'currentStep') {
      return filterIngredientsForCurrentStep(
        currentInstruction,
        parsedIngredients,
        scaledIngredients,
      );
    }
    return scaledIngredients;
  }, [ingredientsFormat, scaledIngredients, currentInstruction, parsedIngredients]);

  const toggleIngredientSelection = (id: string) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id],
    );
  };

  const renderIngredient = useCallback(
    ({ item }: { item: string }) => (
      <CheckBox
        style={styles.checkBox}
        isSelected={selectedIngredients.includes(item)}
        onPress={() => toggleIngredientSelection(item)}
        label={item}
        numberOfLines={3}
      />
    ),
    [selectedIngredients, styles.checkBox],
  );

  const {
    animatedBackdropStyle,
    animatedPaginationStyle,
    animatedSheetStyle,
    animatedIngredientStyle,
    animatedMenuViewStyle,
    gestures,
    handleDismiss,
  } = useIngredientBottomSheetAnimations();

  return (
    <>
      <AnimatedPressable onPress={handleDismiss} style={[styles.backdrop, animatedBackdropStyle]} />
      <GestureDetector gesture={gestures}>
        <View>
          <Animated.View style={[styles.pagination, animatedPaginationStyle]}>
            {instructions.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, currentStep === index ? styles.activeDot : styles.inactiveDot]}
              />
            ))}
          </Animated.View>

          <Animated.View style={[styles.bottomSheet, animatedSheetStyle]}>
            <View style={styles.indicatorContainer}>
              <View style={styles.indicator} />
            </View>

            <Animated.View style={[animatedIngredientStyle, styles.ingredientHeader]}>
              <Typography variant={'titleItalicLarge'} style={styles.title}>
                {translate('cooking_overview.ingredients')}
              </Typography>
            </Animated.View>

            <Animated.View style={animatedMenuViewStyle}>
              <MenuView
                actions={[
                  { id: 'currentStep', title: 'Current Step' },
                  { id: 'all', title: 'All Ingredients' },
                ]}
                onPressAction={({ nativeEvent }) => {
                  const event = nativeEvent?.event as 'currentStep' | 'all';
                  if (!event) return;
                  setIngredientsFormat(event);
                }}
                style={styles.menuView}
              >
                <Icon name={'fork-spoon'} size={16} color={theme.colors.onBackground} />
                <LabelButton
                  title={
                    ingredientsFormat === 'currentStep'
                      ? translate('cooking_overview.current_step')
                      : translate('cooking_overview.all_ingredients')
                  }
                  labelStyle={{ color: theme.colors.primary }}
                />
              </MenuView>
            </Animated.View>

            <FlatList
              contentContainerStyle={styles.ingredientsList}
              data={data}
              renderItem={renderIngredient}
              keyExtractor={keyExtractor}
            />
          </Animated.View>
        </View>
      </GestureDetector>
    </>
  );
};

export default IngredientBottomSheet;
