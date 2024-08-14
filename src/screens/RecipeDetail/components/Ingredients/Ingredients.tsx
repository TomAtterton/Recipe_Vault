import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Tabs } from 'react-native-collapsible-tab-view';

import IngredientItem from '@/screens/RecipeDetail/components/Ingredients/components/IngredientItem';

import IngredientHeader from './components/IngredientsHeader';

import { Ingredient } from '@/types';
import { useFocusEffect } from '@react-navigation/native';
import { getRecipeServings } from '@/database/api/recipes';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './ingredients.style';
import { FlatList } from 'react-native';
import { useBoundStore } from '@/store';

interface IngredientsProps {
  recipeId: string;
  data: Ingredient[];
}

const keyExtractor = (_: string | Ingredient) => (typeof _ === 'string' ? _ : _?.id);

const Ingredients: React.FC<IngredientsProps> = ({ recipeId, data }: IngredientsProps) => {
  const initialServings = useRef(1);
  const [isMetric, setIsMetric] = useState<boolean>(true);
  const setServings = useBoundStore((state) => state.setCurrentServings);

  useFocusEffect(
    useCallback(() => {
      getRecipeServings(recipeId).then((serving) => {
        if (!serving) return;
        setServings(serving || 1);
        initialServings.current = serving || 1;
      });
    }, [recipeId, setServings])
  );

  const handleRenderHeader = useMemo(
    () => <IngredientHeader isMetric={isMetric} setIsMetric={setIsMetric} />,
    [isMetric]
  );
  const { styles, breakpoint } = useStyles(stylesheet);

  const handleRenderIngredient = useCallback(
    ({ item }: { item: string | Ingredient }) => {
      if (typeof item === 'string') {
        return (
          <Typography variant={'titleItalicLarge'} style={styles.sectionHeader}>
            {item}
          </Typography>
        );
      }
      return (
        <IngredientItem
          text={item?.text || ''}
          initialServings={initialServings.current}
          isMetric={isMetric}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMetric]
  );
  const sections = useMemo(() => {
    return data?.reduce((acc: (string | Ingredient)[], ingredient) => {
      const title = ingredient?.title || '';

      if (title) {
        const hasTitle = acc.find((item) => item === title);

        if (!hasTitle) {
          acc.push(title);
        }
      }
      acc.push(ingredient);
      return acc;
    }, []);
  }, [data]);

  const isiPad = breakpoint === 'xl' || breakpoint === 'lg' || breakpoint === 'md';

  const ListComponent = isiPad ? FlatList : Tabs.FlatList;
  return (
    <ListComponent
      keyExtractor={keyExtractor}
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}
      ListHeaderComponent={handleRenderHeader}
      data={sections}
      renderItem={handleRenderIngredient}
    />
  );
};

export default Ingredients;
