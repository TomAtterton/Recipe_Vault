import { addDatabaseChangeListener } from 'expo-sqlite/next';
import { useEffect } from 'react';

let listener: any;

const useDatabaseListener = () => {
  useEffect(() => {
    if (__DEV__) {
      if (listener) listener.remove();
      listener = addDatabaseChangeListener((event) => {
        const tableName = event.tableName;
        console.log('Database CHANGED', tableName, event.rowId);
      });
      return () => {
        listener.remove();
      };
    }
  }, []);
};

export default useDatabaseListener;
