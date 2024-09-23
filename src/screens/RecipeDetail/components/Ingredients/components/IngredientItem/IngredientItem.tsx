import React, { useMemo } from 'react';
import { View } from 'react-native';

import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './ingredientItem.style';
import { useBoundStore } from '@/store';
import {
  onFormatIngredientAmount,
  parseIngredientMetrics,
  scaleAmount,
} from '@/services/parser/ingredients/ingredientParser';

const IngredientItem = ({ text, initialServings }: { text: string; initialServings: number }) => {
  const currentServings = useBoundStore((state) => state.currentServings);
  const recipeUnit = useBoundStore((state) => state.currentRecipeUnit);

  const {
    styles,
    theme: { colors },
  } = useStyles(stylesheet);

  const { description, quantity, unitOfMeasure } = useMemo(
    () =>
      parseIngredientMetrics({
        note: text,
        recipeUnit,
      }) || {},
    [text, recipeUnit],
  );

  const formattedAmount = useMemo(() => {
    const scaledAmount = scaleAmount(quantity, currentServings, initialServings);
    return onFormatIngredientAmount(scaledAmount, unitOfMeasure);
  }, [quantity, currentServings, initialServings, unitOfMeasure]);

  return (
    <View style={styles.container}>
      <Typography variant="bodyMedium" style={styles.recipeText}>
        {formattedAmount && (
          <Typography style={{ color: colors.primary }}>
            {formattedAmount}
            {description && ' '}
          </Typography>
        )}
        {description}
      </Typography>
    </View>
  );
};

export default IngredientItem;
