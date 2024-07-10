import useDatabaseQuery from '@/database/hooks/useDatabaseQuery';
import { SELECT_CATEGORIES } from '@/database/api/categories/index';

const useCategories = () => {
  const { data } = useDatabaseQuery(SELECT_CATEGORIES, []);
  return {
    data,
    isLoading: false,
    isError: false,
    refetch: false,
  };
};

export default useCategories;
