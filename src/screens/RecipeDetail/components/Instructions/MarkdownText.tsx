import React from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text, View } from 'react-native';
import { ingredientDescription, ingredientsParsed } from '@/utils/ingredientParseUtil';
import { useMemo } from 'react';
import { parseRecipeTextToMarkdown } from '@/utils/instructionParseUtil';
import { Ingredient } from '@/types';
import { MenuView } from '@react-native-menu/menu';
import Typography from '@/components/Typography';
import { useBoundStore } from '@/store';

interface Props {
  text: string;
  ingredients: Ingredient[];
  initialServings: number;
}

const MarkdownText = ({ text, ingredients, initialServings }: Props) => {
  const parsedIngredients = useMemo(() => ingredientsParsed(ingredients), [ingredients]);
  const markdownText = useMemo(
    () => parseRecipeTextToMarkdown(text, parsedIngredients),
    [text, parsedIngredients],
  );
  const { styles } = useStyles(stylesheet);

  const currentServings = useBoundStore((state) => state.currentServings);
  const recipeUnit = useBoundStore((state) => state.currentRecipeUnit);

  return (
    <View style={styles.container}>
      <Text>
        {markdownText.split(/(\*\*.*?\*\*)/).map((fragment, index) => {
          if (fragment.startsWith('**')) {
            const ingredient = fragment.slice(2, -2);

            const description = ingredientDescription(
              ingredient,
              ingredients,
              initialServings,
              currentServings,
              recipeUnit,
            );

            const MenuWrapper = description ? MenuView : View;

            return (
              <MenuWrapper key={index} actions={[{ id: `${index}`, title: description || '' }]}>
                <View>
                  <Typography style={styles.strong}>{ingredient}</Typography>
                </View>
              </MenuWrapper>
            );
          } else {
            return (
              <Typography key={index} style={styles.body} lineBreakStrategyIOS={'none'}>
                {fragment}
              </Typography>
            );
          }
        })}
      </Text>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingHorizontal: 12,
  },

  body: {
    color: theme.colors.onBackground,
  },
  strong: {
    ...theme.fonts.bodyMedium,
    color: theme.colors.primary,
    top: 2.6,
  },
}));

export default MarkdownText;
