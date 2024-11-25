import { useCallback, useEffect, useMemo, useState } from 'react';
import { SQLiteBindParams } from 'expo-sqlite';
import { addDatabaseChangeListener } from 'expo-sqlite';
import { database } from '@/database';
import { useFocusEffect } from '@react-navigation/native';

function extractTableName(query: string) {
  // Convert the query to uppercase to handle different casings of 'FROM'
  const upperQuery = query.toUpperCase();

  // Find the position of 'FROM' in the query
  const fromIndex = upperQuery.indexOf('FROM');

  if (fromIndex === -1) {
    // 'FROM' not found in the query
    return null;
  }

  // Extract the substring after 'FROM'
  const fromSubstring = query.substring(fromIndex + 4).trim();

  // Get the first word after 'FROM' which should be the table name
  return fromSubstring.split(' ')[0].trim();
}

const useSQLSyncQuery = (query: string, params: SQLiteBindParams) => {
  // const db = useSQLiteContext();
  const [data, setData] = useState<any[]>([]);
  // const [isLoading, setLoading] = useState(true); // Track loading state
  // const [error, setError] = useState(null); // Track errors

  // @ts-ignore
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedParams = useMemo(() => params, [...params]);

  // get table name from query after FROM
  const tableName = useMemo(() => extractTableName(query), [query]);

  const fetchDatabase = useCallback(async () => {
    try {
      const result = await database?.getAllAsync(query, memoizedParams);
      result && setData(result || []);
      // setLoading(false); // Data is received, so loading is done
    } catch (e) {
      // @ts-ignore
      console.error('An error occurred:', e.message); // Log the human-readable error message
      // @ts-ignore
      setError(e?.message || 'An error occurred');
      // setLoading(false); // Error occurred, so loading is done
    }
  }, [memoizedParams, query]);

  useFocusEffect(
    useCallback(() => {
      fetchDatabase();
    }, [fetchDatabase]),
  );

  useEffect(() => {
    const unsubscribe = addDatabaseChangeListener((event) => {
      if (event.tableName !== tableName) return;
      fetchDatabase();
    });

    return () => {
      unsubscribe.remove();
    };
  }, [fetchDatabase, tableName]);

  useEffect(() => {
    // Reset states when query or parameters change
    // setLoading(true);
    // setError(null);
    fetchDatabase();
  }, [fetchDatabase, memoizedParams, query]);

  return {
    data,
    isLoading: false,
    error: null,
  };
};

export default useSQLSyncQuery;
