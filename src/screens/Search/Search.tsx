import { View } from 'react-native';
import SearchBar from '@/screens/Home/components/SearchBar';
import React, { useCallback } from 'react';
import useSearchRecipe from '@/hooks/recipe/useSearchRecipe';
import { FlashList } from '@shopify/flash-list';
import { useNavigation, useRoute } from '@react-navigation/native';
import usePostMealPlan from '@/database/api/mealplan/usePostMealPlan';
import { showErrorMessage, showSuccessMessage } from '@/utils/promptUtils';
import styles from './search.style';
import type { RouteProp } from '@/navigation/types';
import { Routes } from '@/navigation/Routes';
import { RecipeSearchItemType } from '@/database/api/recipes/hooks/useFilterRecipe';
import VerticalCard from '@/components/cards/VerticalCard';
import { translate } from '@/core';

const Search = ({}) => {
  const { searchText, setSearchText, data } = useSearchRecipe();
  const { params } = useRoute<RouteProp<Routes.Search>>();
  const { entryType, selectDate } = params || {};
  const { addMealPlan } = usePostMealPlan();
  const { goBack } = useNavigation();

  const handleAddToMealPlan = useCallback(
    async ({ id, title }: { id: string; title: string }) => {
      try {
        await addMealPlan({
          title,
          recipeId: id,
          date: selectDate,
          entryType: entryType,
        });
        showSuccessMessage('Meal plan added successfully');
        goBack();
      } catch (e) {
        showErrorMessage(translate('error.default.error_message'));
        console.log('error', e);
      }
    },
    [addMealPlan, entryType, goBack, selectDate],
  );

  const handleRenderItem = useCallback(
    ({ item }: { item: RecipeSearchItemType }) => (
      <VerticalCard
        {...item}
        onPress={() =>
          handleAddToMealPlan({
            id: item.id,
            title: item.name,
          })
        }
      />
    ),
    [handleAddToMealPlan],
  );

  return (
    <View style={styles.container}>
      <SearchBar style={styles.searchBar} searchText={searchText} setSearchText={setSearchText} />
      <FlashList
        estimatedItemSize={100}
        renderItem={handleRenderItem}
        data={data || []}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Search;
