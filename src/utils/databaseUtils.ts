import { setCurrentDatabaseName, setShouldSync } from '@/store';
import { syncWithSupabase } from '@/services/sync';
import { onOpenDatabase } from '@/database';

export const setupDatabase = async ({ databaseName }: { databaseName: string }) => {
  try {
    if (!databaseName) throw new Error('Database name not provided');
    setShouldSync(true);
    const currentDatabaseName = `${databaseName}.db`;
    setCurrentDatabaseName(currentDatabaseName);
    await onOpenDatabase({ currentDatabaseName });
    await syncWithSupabase();
  } catch (e) {
    console.log('error setting up database', e);
    throw e;
  }
};
