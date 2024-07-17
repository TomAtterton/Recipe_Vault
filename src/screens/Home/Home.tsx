import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import FilterOptions from 'src/screens/Home/components/FilterOptions';
import SearchBar from 'src/screens/Home/components/SearchBar';
import useSearchRecipe from '@/hooks/recipe/useSearchRecipe';

import styles from './home.style';
import SearchList from '@/screens/Home/components/SearchList';
import HeaderContainer from '@/screens/Home/components/HeaderContainer';
import TrySomethingCarousel from '@/screens/Home/components/TrySomethingCarousel';
import Animated from 'react-native-reanimated';
import HomeAnimation from '@/screens/Home/homeAnimation';
import CategorySelection from '@/components/RecipeForm/components/CategorySelection';
import useDatabaseListener from '@/database/hooks/useDatabaseListener';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { checkIfPro } from '@/utils/proPurchaseUtils';

const Home = () => {
  const {
    filterOptions,
    setFilterOptions,
    categories,
    setCategories,
    searchText,
    setSearchText,
    data,
  } = useSearchRecipe();

  const [showingSearch, setShowingSearch] = useState(false);

  const onSearchFocus = useCallback(() => {
    setShowingSearch(true);
  }, []);

  useEffect(() => {
    checkIfPro();
  }, []);

  useDatabaseListener();
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
        },
      ]}
    >
      {!showingSearch && <HeaderContainer />}
      <Animated.View style={styles.searchContainer} {...HomeAnimation.searchContainerAnimation}>
        <SearchBar
          onFocus={onSearchFocus}
          searchText={searchText}
          setSearchText={setSearchText}
          setShowingSearch={setShowingSearch}
          showingSearch={showingSearch}
        />
      </Animated.View>

      {showingSearch && (
        <Animated.View style={styles.filterContainer} {...HomeAnimation.categoryListAnimation}>
          <FilterOptions currentFilters={filterOptions} onUpdateFilter={setFilterOptions} />
          <CategorySelection selectedCategories={categories} onSetCategories={setCategories} />
        </Animated.View>
      )}
      {showingSearch && <SearchList data={data} />}
      {!showingSearch && <TrySomethingCarousel onSeeAll={onSearchFocus} />}
    </View>
  );
};

export default Home;
