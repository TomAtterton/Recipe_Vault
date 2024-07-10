import { useState } from 'react';

import { defaultFilterOptions } from '@/screens/Home/components/FilterOptions/FilterOptions';
import { useDebounce } from '@/hooks/common/useDebounce';
import { FilterObjectType } from '@/utils/filterUtils';
import useFilterRecipes from '@/database/api/recipes/hooks/useFilterRecipe';

const useSearchRecipe = () => {
  const [searchText, setSearchText] = useState('');

  const [categories, setCategories] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterObjectType>(defaultFilterOptions);

  const search = useDebounce(searchText, 1000);

  const { data } = useFilterRecipes({
    categories,
    filterOptions,
    search,
  });

  return {
    filterOptions,
    setFilterOptions,
    categories,
    setCategories,
    searchText,
    setSearchText,
    refetch: () => {},
    data,
    isLoading: false,
    isError: false,
  };
};

export default useSearchRecipe;
