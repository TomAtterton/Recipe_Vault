import useSQLSyncQuery from '@/database/sql/hooks/useSQLSyncQuery';

/**
 *  Wrapper for usePowerSyncWatchedQuery to support the ability to change the query
 * @param sqlStatement
 * @param parameters
 // * @param options
 */
const useDatabaseQuery = (
  sqlStatement: string,
  parameters: any[] = [],
  // options: Omit<SQLWatchOptions, 'signal'> = {}
) => {
  const { data, isLoading, error } = useSQLSyncQuery(sqlStatement, parameters);

  return {
    data,
    isLoading,
    error,
  };
};

export default useDatabaseQuery;
