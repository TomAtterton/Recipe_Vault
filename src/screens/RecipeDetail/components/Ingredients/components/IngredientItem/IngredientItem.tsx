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
    [text, isMetric]
  );
  const {
    styles,
    theme: { colors },
  } = useStyles(stylesheet);

  const amount = useMemo(() => {
    return scaleAmount(quantity, currentServings, initialServings);
  }, [quantity, currentServings, initialServings]);

  return (
    <View style={styles.container}>
      <Typography variant="bodyMedium" style={[styles.recipeText, { color: colors.primary }]}>
        {`${amount === '0' ? '' : amount}${unitOfMeasure ? ` ${unitOfMeasure}` : ''}`}
        <Typography variant="bodyMedium" style={styles.recipeText}>
          {` ${description}`}
        </Typography>
      </Typography>
    </View>
  );
};

export default IngredientItem;
