import React, { useMemo } from 'react';
import { View } from 'react-native';

import { parseMetrics, scaleAmount } from '@/utils/igredientsUtil';
import { Ingredient } from '@/types';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from '@/screens/RecipeDetail/components/Ingredients/components/IngredientItem/ingredientItem.style';

const IngredientItem = ({
  item,
  isMetric,
  servings,
  initialServings,
}: {
  item: Ingredient;
  isMetric: boolean;
  servings: number;
  initialServings: number;
}) => {
  const { description, quantity, unitOfMeasure } = useMemo(
    () =>
      parseMetrics({
        note: item?.text,
        isMetric: isMetric,
      }) || {},
    [item, isMetric]
  );
  const {
    styles,
    theme: { colors },
  } = useStyles(stylesheet);
  return (
    <View style={styles.container}>
      <Typography variant="bodyMedium" style={[styles.recipeText, { color: colors.primary }]}>
        {quantity
          ? `${scaleAmount(quantity, servings, initialServings)} ${unitOfMeasure ?? ''} `
          : ''}
        <Typography variant="bodyMedium" style={styles.recipeText}>
          {description}
        </Typography>
      </Typography>
    </View>
  );
};

export default IngredientItem;
