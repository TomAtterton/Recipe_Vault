import React, { useMemo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View } from 'react-native';
import { MenuView } from '@react-native-menu/menu';
import Typography from '@/components/Typography';
import { parseIngredientToMarkdown } from '@/services/parser/ingredients/markdownParser';
import { Ingredient } from '@/types';
import { ingredientDescription } from './helper';

interface Props {
  text: string;
  sanitizedIngredients: string[];
  ingredients: Ingredient[];
  initialServings: number;
}

const MarkdownText = ({ text, sanitizedIngredients, ingredients, initialServings }: Props) => {
  const markdownText = useMemo(
    () => parseIngredientToMarkdown(text, sanitizedIngredients),
    [text, sanitizedIngredients],
  );

  const { styles } = useStyles(stylesheet);

  const defaultVariant = 'titleMedium';

  return (
    <View style={styles.container}>
      <Typography>
        {markdownText.split(/(\*\*.*?\*\*|~~.*?~~|\^\^.*?\^\^)/).map((fragment, index) => {
          if (fragment.startsWith('**')) {
            // Ingredient handling
            const ingredientKeyword = fragment.slice(2, -2);

            const description = ingredientDescription(
              ingredientKeyword,
              ingredients,
              initialServings,
            );

            const MenuWrapper = description ? MenuView : View;

            return (
              <MenuWrapper key={index} actions={[{ id: `${index}`, title: description || '' }]}>
                <View>
                  <Typography variant={defaultVariant} style={[styles.strong, styles.base]}>
                    {ingredientKeyword}
                  </Typography>
                </View>
              </MenuWrapper>
            );
          } else if (fragment.startsWith('~~')) {
            // Time handling
            const timeValue = fragment.slice(2, -2);

            return (
              <Typography variant={defaultVariant} key={index} style={[styles.time, styles.base]}>
                {timeValue}
              </Typography>
            );
          } else if (fragment.startsWith('^^')) {
            // Temperature handling
            const tempValue = fragment.slice(2, -2);

            return (
              <Typography
                variant={defaultVariant}
                key={index}
                style={[styles.temperature, styles.base]}
              >
                {tempValue}
              </Typography>
            );
          } else {
            return (
              <Typography
                variant={defaultVariant}
                key={index}
                style={[styles.body, styles.base]}
                lineBreakStrategyIOS={'none'}
              >
                {fragment}
              </Typography>
            );
          }
        })}
      </Typography>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingHorizontal: 12,
  },
  base: {},
  body: {
    color: theme.colors.onBackground,
  },
  strong: {
    color: theme.colors.primary,
    top: 2.6,
  },
  time: {
    color: theme.colors.time,
    fontStyle: 'italic',
  },
  temperature: {
    color: theme.colors.temperature,
  },
}));

export default MarkdownText;
