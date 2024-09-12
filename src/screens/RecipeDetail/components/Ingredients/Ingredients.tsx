import React, { useCallback, useMemo } from 'react';
import { Tabs } from 'react-native-collapsible-tab-view';
import { FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useBoundStore } from '@/store';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';

import IngredientItem from '@/screens/RecipeDetail/components/Ingredients/components/IngredientItem';
import IngredientHeader from './components/IngredientsHeader';
import { Ingredient } from '@/types';
import { getRecipeServings } from '@/database/api/recipes';
import { stylesheet } from './ingredients.style';

interface IngredientsProps {
  recipeId: string;
  data: Ingredient[];
  initialServings: number;
}

const Ingredients: React.FC<IngredientsProps> = ({ recipeId, data, initialServings }) => {
  const setServings = useBoundStore((state) => state.setCurrentServings);

  const { styles, breakpoint } = useStyles(stylesheet);
  useFocusEffect(
    useCallback(() => {
      const fetchServings = async () => {
        const serving = await getRecipeServings(recipeId);
        if (serving) {
          setServings(serving);
        }
      };
      fetchServings();
    }, [recipeId, setServings]),
  );

  const handleRenderHeader = useMemo(() => <IngredientHeader />, []);

  const handleRenderIngredient = useCallback(
    ({ item }: { item: string | Ingredient }) => {
      if (typeof item === 'string') {
        return (
          <Typography variant="titleItalicLarge" style={styles.sectionHeader}>
            {item}
          </Typography>
        );
      }
      return <IngredientItem text={item?.text || ''} initialServings={initialServings || 1} />;
    },
    [initialServings, styles.sectionHeader],
  );

  const sections = useMemo(
    () =>
      data.reduce((acc: (string | Ingredient)[], ingredient) => {
        const title = ingredient?.title || '';
        if (title && !acc.includes(title)) {
          acc.push(title);
        }
        acc.push(ingredient);
        return acc;
      }, []),
    [data],
  );

  const ListComponent = useMemo(() => {
    return ['xl', 'lg', 'md'].includes(breakpoint) ? FlatList : Tabs.FlatList;
  }, [breakpoint]);

  return (
    <ListComponent
      keyExtractor={(_, index) => index.toString()}
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}
      ListHeaderComponent={handleRenderHeader}
      data={sections}
      renderItem={handleRenderIngredient}
    />
  );
};

export default Ingredients;
