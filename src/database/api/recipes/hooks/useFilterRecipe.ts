import { useMemo } from 'react';
import useDatabaseQuery from '@/database/hooks/useDatabaseQuery';
import { FilterObjectType, generateFilterSelect } from '@/utils/filterUtils';

interface Props {
  categories: string[];
  filterOptions: FilterObjectType;
  search: string;
}

export type RecipeSearchItemType = {
  id: string;
  name: string;
  description: string;
  rating: number;
  performTime: number;
  prepTime: number;
  image: string;
};
const useFilterRecipes = ({ categories, filterOptions, search }: Props) => {
  const select = useMemo(
    () => generateFilterSelect(categories, filterOptions, search),
    [categories, filterOptions, search]
  );

  const { data: recipes } = useDatabaseQuery(select, []);

  const data = useMemo(
    () =>
      recipes?.map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        rating: recipe.rating,
        performTime: recipe.cook_time,
        prepTime: recipe.prep_time,
        image: recipe.image,
      })),
    [recipes]
  );

  return {
    data,
  };
};

export default useFilterRecipes;
