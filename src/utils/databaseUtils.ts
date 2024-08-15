import { setCurrentDatabaseName, setShouldSync } from '@/store';
import { syncWithSupabase } from '@/services/sync';
import { onOpenDatabase } from '@/database';

export const setupDatabase = async ({ databaseName }: { databaseName: string }) => {
  try {
    if (!databaseName) throw new Error('Database name not provided');
    setShouldSync(true);
    setCurrentDatabaseName(databaseName);
    await onOpenDatabase({ currentDatabaseName: databaseName });
    await syncWithSupabase();
  } catch (e) {
    console.log('error setting up database', e);
    throw e;
  }
};
