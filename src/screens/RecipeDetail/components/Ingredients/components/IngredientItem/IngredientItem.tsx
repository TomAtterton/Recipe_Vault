import React, { useMemo } from 'react';
import { View } from 'react-native';

import { parseMetrics, scaleAmount } from '@/utils/igredientsUtil';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './ingredientItem.style';
import { useBoundStore } from '@/store';

const IngredientItem = ({
  text,
  isMetric,
  initialServings,
}: {
  text: string;
  isMetric: boolean;
  initialServings: number;
}) => {
  const currentServings = useBoundStore((state) => state.currentServings);

  const { description, quantity, unitOfMeasure } = useMemo(
    () =>
      parseMetrics({
        note: text,
        isMetric: isMetric,
      }) || {},
    [text, isMetric],
  );
  const {
    styles,
    theme: { colors },
  } = useStyles(stylesheet);

  const amount = useMemo(() => {
    return scaleAmount(quantity, currentServings, initialServings);
  }, [quantity, currentServings, initialServings]);

  const formattedAmount = useMemo(() => {
    if (!amount && !unitOfMeasure) return '';
    if (!amount) return unitOfMeasure;
    if (!unitOfMeasure) return amount;
    return `${amount} ${unitOfMeasure}`;
  }, [amount, unitOfMeasure]);

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
