import { useMemo } from 'react';
import useDatabaseQuery from '@/database/hooks/useDatabaseQuery';
import { SELECT_MEALPLANS } from '@/database/api/mealplan/index';

const useGetMealplan = ({ startDate, endDate }: { startDate?: string; endDate?: string }) => {
  const { data, isLoading, error } = useDatabaseQuery(SELECT_MEALPLANS, [startDate, endDate]);

  const formatData = useMemo(() => {
    return data?.map((item) => ({
      id: item.id,
      recipeId: item.recipe_id,
      title: item.name,
      image: item.image,
      date: item.date,
      entryType: item.type,
    }));
  }, [data]);

  return {
    data: formatData,
    isLoading: isLoading,
    isError: !!error,
  };
};

export default useGetMealplan;
