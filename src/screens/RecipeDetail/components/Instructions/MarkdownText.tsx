import React from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View, Text } from 'react-native';
import { ingredientDescription, ingredientsParsed } from '@/utils/ingredientParseUtil';
import { useMemo } from 'react';
import { parseRecipeTextToMarkdown } from '@/utils/instructionParseUtil';
import { Ingredient } from '@/types';
import { MenuView } from '@react-native-menu/menu';

interface Props {
  text: string;
  ingredients: Ingredient[];
}

const MarkdownText = ({ text, ingredients }: Props) => {
  const parsedIngredients = useMemo(() => ingredientsParsed(ingredients), [ingredients]);
  const markdownText = useMemo(
    () => parseRecipeTextToMarkdown(text, parsedIngredients),
    [text, parsedIngredients],
  );
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Text style={styles.contentContainer}>
        {markdownText.split(/(\*\*.*?\*\*)/).map((fragment, index) => {
          if (fragment.startsWith('**')) {
            const ingredient = fragment.slice(2, -2);
            const description = ingredientDescription(ingredient, ingredients);
            const MenuWrapper = description ? MenuView : View;

            return (
              <MenuWrapper
                key={index}
                actions={[{ id: `${index}`, title: description || '' }]}
                style={styles.strongContainer}
              >
                <View>
                  <Text style={styles.strong}>{ingredient}</Text>
                </View>
              </MenuWrapper>
            );
          } else {
            return (
              <Text key={index} style={styles.body} lineBreakStrategyIOS={'none'}>
                {fragment}
              </Text>
            );
          }
        })}
      </Text>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    paddingLeft: 12,
    flexGrow: 1,
  },
  contentContainer: {
    ...theme.fonts.bodyMedium,
  },

  body: {
    color: theme.colors.onBackground,
  },
  strongContainer: {
    maxHeight: 18,
  },
  strong: {
    ...theme.fonts.bodyMedium,
    color: theme.colors.primary,
  },
}));

export default MarkdownText;
