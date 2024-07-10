import useDatabaseQuery from '@/database/hooks/useDatabaseQuery';
import { SELECT_TAGS } from '@/database/api/tags/index';

const useGetTags = () => {
  const { data } = useDatabaseQuery(SELECT_TAGS, []);
  return {
    data,
    isLoading: [],
    isError: false,
    refetch: () => {},
  };
};

export default useGetTags;
