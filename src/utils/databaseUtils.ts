import { setCurrentDatabaseName, setShouldSync } from '@/store';
import { openDatabase } from '@/database';
import { syncWithSupabase } from '@/services/sync';

export const setupDatabase = async ({ databaseName }: { databaseName: string }) => {
  try {
    if (!databaseName) throw new Error('Database name not provided');
    setShouldSync(true);
    const currentDatabaseName = `${databaseName}.db`;
    setCurrentDatabaseName(currentDatabaseName);
    await openDatabase({ currentDatabaseName });
    await syncWithSupabase();
  } catch (e) {
    console.log('error setting up database', e);
    throw e;
  }
};
