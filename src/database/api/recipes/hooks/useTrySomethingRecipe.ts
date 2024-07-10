import useDatabaseQuery from '@/database/hooks/useDatabaseQuery';
import { SELECT_TRY_SOMETHING } from '@/database/api/recipes';

const useTrySomethingRecipe = () => {
  const { data, isLoading, error } = useDatabaseQuery(SELECT_TRY_SOMETHING);
  return {
    data,
    isLoading,
    isError: !!error,
  };
};

export default useTrySomethingRecipe;
